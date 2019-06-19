const { Readable } = require('stream');
const _ = require('lodash');
const debug = require('debug')('epicor');
const defaultWriteSize = 500;

class SyncStream extends Readable {
  constructor(connection, serviceName, path, conf) {
    // console.log({ connection, serviceName, path, conf });
    const { childFields, idField, writeSize = defaultWriteSize, query } = conf;
    // console.log('created stream with query: ', query);
    super({ highWaterMark: writeSize, objectMode: true });
    this.connection = connection;
    this.idField = idField || 'SysRowID';
    this.isReading = false;
    this.limit = Infinity;
    this.maxPages = Infinity;
    this.numRetrieved = 0;
    this.page = 0;
    this.pageSize = _.floor(writeSize / 2);
    this.writeSize = writeSize;
    this.path = path;
    this.reqMethod = 'GET';
    this.service = `Erp.BO.${serviceName}Svc`;
    this.query = query;

    const { $select: sel } = this.query;
    if (!_.includes(sel, this.idField)) {
      this.query.$select = `${sel},${this.idField}`;
    }
    this.childFields = childFields;
    this.fieldArray = _.split(this.query.$select, ',');
    this.expandedArray = _.split(this.query.$expand, ',');
    this.hasExpanded = this.expandedArray.length > 0;
    this.expandedRecords = {};
    _.each(this.expandedArray, (table) => { this.expandedRecords[table] = []; });
    const date = new Date();
    this.updatedAtVal = date.toISOString();
  }

  get props() {
    return _.defaultsDeep(
      { qs: { $top: this.pageSize, $skip: this.pageSize * this.page }},
      { qs: this.query },
      { method: this.reqMethod }
    );
  }

  getRows() {
    return this.connection.makeRequest(
      this.service, this.path, {}, undefined, this.props);
  }

  _read(/* n */) {
    if (!this.isReading) {
      this.isReading = true;
      this.startReading();
    }
  }

  extractExpanded(record) {
    _.each(this.expandedArray, (table) => {
      let children = record[table];
      if (children && !_.isEmpty(children)) {
        /* check for explicitly defined fields */
        if (_.has(this.childFields, [table])) {
          children = _.map(children, (child) =>
            _.pick(child, this.childFields[table])
          );
        }
        /* add children to expandedRecords sent after done */
        this.expandedRecords[table] = _.concat(this.expandedRecords[table], children);
        /* note total number of children */
        if (_.isArray(children)) record[`${table}Count`] = children.length;
        /* remove expanded from parent */
        delete record[table];

        /* start expanded write if expanded record length exceeds page size */
        if (this.expandedRecords[table].length >= this.writeSize) {
          this.push({ expanded: { [table]: this.expandedRecords[table] }});
          this.expandedRecords[table] = [];
        }
      }
    });
    return record;
  }

  cleanup() {
    if (this.hasExpanded) {
      const expanded = _.omitBy(this.expandedRecords, _.isEmpty);
      if (!_.isEmpty(expanded)) this.push({ expanded });
    }
    this.push(null);
    return;
  }

  startReading() {
    debug('start reading records with where = ' + this.where);
    /* add some props when necessary (i.e. when not making a POST) */

    this.getRows().then(({ value }) => {
      debug(`got ${value.length} records`);
      /* array with length of 0 will simply end */
      if (!value || !value.length) { this.cleanup(); }
      for (let record of value) {
        if (this.hasExpanded) record = this.extractExpanded(record);
        /* set updatedAt */
        record.updatedAt = this.updatedAtVal;
        this.push({ updateOne: {
          filter: { [this.idField]: record[this.idField] },
          update: record,
          upsert: true,
          bypassDocumentValidation: false,
          ordered: false,
        }});
        this.numRetrieved++;
        if (this.numRetrieved === this.limit) { this.cleanup(); }
      }

      const morePages = value.length === this.pageSize;
      if (this.page >= this.maxPages || !morePages) {
        this.cleanup();
      } else {
        this.page++;
        setImmediate(() => this.startReading());
      }
    },
    err => { this.emit('error', err); }
    );
  }
}

module.exports = SyncStream;
