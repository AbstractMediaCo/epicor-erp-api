const { Readable } = require('stream');
const _ = require('lodash');
const debug = require('debug')('epicor');
const parseDatasetAsRecords = require('./parseDatasetAsRecords');

class FindStream extends Readable {
  constructor(getRows, path, where, pageSize, limit, keyField, reqProps) {
    super({ highWaterMark: pageSize, objectMode: true });
    this.getRows = getRows;
    this.pageSize = pageSize;
    this.where = where;
    this.page = 0;
    this.limit = limit;
    this.keyField = keyField;
    this.isReading = false;
    this.numRetrieved = 0;
    this.path = path;
    this.reqProps = reqProps;
    this.maxPages = limit > 0 ? _.ceil(limit / pageSize) : Infinity;
    this.reqMethod = reqProps.method ? reqProps.method :
      path === 'GetList' || path === 'GetRows' ?
        'POST' : 'GET';
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
    const method = this.reqMethod;
    const props = _.defaultsDeep({
      qs: method === 'POST' ? {} : {
        $top: this.pageSize,
        $skip: this.pageSize * this.page
      }
    }, this.reqProps, {
      method
    });
    this.getRows(this.where, this.pageSize, this.page, this.path, props).then(
      (resp) => {
        const { dataset, morePages } = resp;
        const records = this.reqMethod === 'POST' ?
          parseDatasetAsRecords(dataset, this.keyField) : dataset;
        debug(`got ${records.length} records`);
        // console.log({ props, maxPages: this.maxPages, pageSize: this.pageSize,
        //   limit: this.limit, page: this.page, dsLen: records.length });
        /* once $skip > total table length, request will return empty */
        if (!records || !records.length) { this.push(null); return; }
        for (const record of records) {
          this.push(record);
          this.numRetrieved++;
          if (this.numRetrieved === this.limit) { this.push(null); return; }
        }
        if (this.page >= this.maxPages || !morePages) {
          this.push(null);
        } else {
          this.page++;
          setImmediate(() => this.startReading());
        }
      },
      err => {
        this.emit('error', err);
      }
    );
  }
}

module.exports = FindStream;
