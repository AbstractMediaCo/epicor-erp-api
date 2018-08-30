const { Readable } = require('stream');
const debug = require('debug')('epicor');
const parseDatasetAsRecords = require('./parseDatasetAsRecords');

class FindStream extends Readable {
  constructor(getRows, where, pageSize, limit, keyField) {
    super({ highWaterMark: pageSize, objectMode: true });
    this.getRows = getRows;
    this.pageSize = pageSize;
    this.where = where;
    this.page = 0;
    this.limit = limit;
    this.keyField = keyField;
    this.isReading = false;
    this.numRetrieved = 0;
  }

  _read(n) {
    if (!this.isReading) {
      this.isReading = true;
      this.startReading();
    }
  }

  startReading() {
    debug('start reading records with where = ' + this.where);
    this.getRows(this.where, this.pageSize, this.page).then(
      (resp) => {
        const { dataset, morePages } = resp;
        const records = parseDatasetAsRecords(dataset, this.keyField);
        debug(`got ${records.length} records`);
        for (const record of records) {
          this.push(record);
          this.numRetrieved++;
          if (this.numRetrieved === this.limit) {
            this.push(null);
            return;
          }
        }
        if (!morePages) {
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
