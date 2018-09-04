const { Readable } = require('stream');
const _ = require('lodash');
const debug = require('debug')('epicor');

class SyncStream extends Readable {
  constructor(connection, serviceName, path, idField, select) {
    super({ highWaterMark: 100, objectMode: true });
    this.connection = connection;
    this.idField = idField || 'SysRowID';
    this.isReading = false;
    this.limit = Infinity;
    this.maxPages = Infinity;
    this.numRetrieved = 0;
    this.page = 0;
    this.pageSize = 1000;
    this.path = path;
    this.reqMethod = 'GET';
    this.service = `Erp.BO.${serviceName}Svc`;
    this.where = '';
    this.select = _.includes(select, idField) ? select : `${select},${idField}`;
  }
  get props() {
    return _.defaultsDeep({ qs: {
      $top: this.pageSize,
      $select: this.select,
      $skip: this.pageSize * this.page,
    }}, this.reqProps, { method: this.reqMethod });
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

  startReading() {
    debug('start reading records with where = ' + this.where);
    /* add some props when necessary (i.e. when not making a POST) */

    this.getRows().then(({ value }) => {
      debug(`got ${value.length} records`);
      /* array with length of 0 will simply end */
      if (!value || !value.length) { this.push(null); return; }
      for (const record of value) {
        this.push({ updateOne: {
          filter: { [this.idField]: record[this.idField] },
          update: record,
          upsert: true,
          bypassDocumentValidation: true,
          ordered: false,
        }});
        this.numRetrieved++;
        if (this.numRetrieved === this.limit) { this.push(null); return; }
      }

      const morePages = value.length === this.pageSize;
      if (this.page >= this.maxPages || !morePages) {
        this.push(null);
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
