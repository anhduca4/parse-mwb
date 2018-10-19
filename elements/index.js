const xpath = require('xpath');
const _ = require('lodash');
const Base = require('./base');

class Index {
  constructor(index) {
    this.base = new Base(index);
    this.id = '';
    this.primary = false;
    this.unique = false;
    this.columns = [];
    this.columnIds = [];
    this.name = '';
    this.comment = '';
    this.parse();
  }

  parse() {
    this.id = this.base.getId();
    this.columnIds = [];
    const columns = xpath.select('.//value[@struct-name="db.mysql.IndexColumn"]', this.base.object);
    if (columns && Array.isArray(columns) && columns.length > 0) {
      _.forEach(columns, (column) => {
        const ids = xpath.select('link[@struct-name="db.Column"]', column);
        _.forEach(ids, (id) => {
          if (id && id.childNodes && id.childNodes[0]) {
            this.columnIds.push(id.childNodes[0].nodeValue);
          }
        })
      });
    }
    this.parseSpecificAttributes();
  }

  /**
   * parseSpecificAttributes
   */
  parseSpecificAttributes(){
    this.name = this.base.getValue('name');
    this.primary = this.base.getValue('isPrimary') === 1;
    this.unique = this.base.getValue('unique') === 1;
  }
  
  resolveColumns(columns) {
    _.forEach(this.columnIds, (id) => {
      if (columns && columns[id]) {
        this.columns.push(columns[id]);
      }
    });
  }

  /**
   * @return string
   */
  getId() {
    return this.id;
  }

  /**
   * @return {Array<*>}
   */
  getColums() {
    return this.columns;
  }

  /**
   * @returns {String<*>}
   */
  getName() {
    return this.name;
  }

  /**
   * @returns {Boolean<*>}
   */
  isPrimary() {
    return this.primary;
  }

  /**
   * @returns {Boolean<*>}
   */
  isUnique() {
    return this.unique;
  }
}

module.exports = Index;
