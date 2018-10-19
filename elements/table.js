const fs = require('fs');
const _ = require('lodash');
const xpath = require('xpath');
const Base = require('./base');
const Column = require('./column');
const Index = require('./index');
const ForeignKey = require('./foreign_key');

class Table {
  constructor(table){
    this.id = '';
    this.name = '';
    this.columns = [];
    this.indexes = [];
    this.foreignKeys = [];
    this.base = new Base(table);
    this.parse();
  }

  parse() {
    this.id = this.base.object.getAttribute('id');
    this.name = this.base.getValue('name');
    this.parseColumns();
    const ids = {};
    _.forEach(this.columns, (column) => {
      ids[column.getId()] = column;
    });
    this.parseIndexes(ids);
    return this;
  }

  /**
   * parse to columns
   * 
   * @return {Array<*>}
   */
  parseColumns() {
    const columes = xpath.select('.//value[@struct-name="db.mysql.Column"]', this.base.object);
    if (columes && Array.isArray(columes) && columes.length > 0) {
      _.forEach(columes, (eComue, index) => {
        this.columns.push(new Column(eComue));
      });
    }
  }

  /**
   * Parse to indexs
   * 
   * @returns {Array<*>}
   */
  parseIndexes(ids) {
    const indexes = xpath.select('.//value[@struct-name="db.mysql.Index"]', this.base.object);
    if (indexes && Array.isArray(indexes) && indexes.length > 0) {
      _.forEach(indexes, (eIndex, i) => {
        let index = new Index(eIndex);
        index.resolveColumns(ids);
        this.indexes.push(index);
      });
    }
  }

  /**
   * Parse list ForeignKey
   *
   */
  parseForeignKey(ids) {
    const foreignKeys = xpath.select('.//value[@struct-name="db.mysql.ForeignKey"]', this.base.object);
    _.forEach(foreignKeys, (eforeignKey) => {
      let foreignKeyElement = new ForeignKey(eforeignKey);
      foreignKeyElement.resolveColumns(ids);
      this.foreignKeys.push(foreignKeyElement);
    });
  }

  /**
   * @param {Array}
   */
  resolveForeignKeyReference(tables) {
    _.forEach(this.foreignKeys, (foreignKey, iForeignKey) => {
      this.foreignKeys[iForeignKey].resolveReferencedTableAndColumn(tables);
    });
  }

  /**
   * 
   * @param {*} id 
   */
  getColumnById(id){
    _.forEach(this.columns, (column) => {
      if (column.getId() === id) {
        return column;
      }
    });
    return null;
  }

  /**
   * @return string
   */
  getId() {
    return this.id;
  }

  /**
   * @returns {String<*>}
   */
  getName() {
    return this.name;
  }

  /**
   * @return {Array<*>}
   */
  getColums() {
    return this.columns;
  }

  /**
   * @return {Array<*>}
   */
  getIndexes() {
    return this.indexes;
  }

  /**
   * @return {Array<*>}
   */
  getForeignKey() {
    return this.foreignKeys;
  }
}

module.exports = Table;
