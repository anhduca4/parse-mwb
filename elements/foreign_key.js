const Base = require('./base');

class ForeignKey {
  constructor(eForeignKey) {
    this.base = new Base(eForeignKey);
    this.id = '';
    this.name = '';
    this.many = false;
    this.columns = [];
    this.columnIds = [];
    this.referencedTableName = '';
    this.referencedColumns = [];
    this.referencedColumnIds = [];
    this.referencedTableId = '';
    this.updateRule = '';
    this.deleteRule = '';
    this.parse();
  }

  parse() {
    this.id = this.base.getId();
    const columns = xpath.select('.//value[@key="columns"]', this.base.object);
    this.columnIds = [];
    this.referencedColumnIds = [];
    if (columns && Array.isArray(columns) && columns.length > 0) {
      _.forEach(columns, (column) => {
        const ids = xpath.select('link[@type="object"]', column);
        _.forEach(ids, (id) => {
          if (id && id.childNodes && id.childNodes[0]) {
            this.columnIds.push(id.childNodes[0].nodeValue);
          }
        })
      });
    }
    const referencedColumns = xpath.select('.//value[@key="referencedColumns"]', this.base.object);
    if (referencedColumns && Array.isArray(referencedColumns) && referencedColumns.length > 0) {
      _.forEach(referencedColumns, (column) => {
        const ids = xpath.select('link[@type="object"]', column);
        _.forEach(ids, (id) => {
          if (id && id.childNodes && id.childNodes[0]) {
            this.referencedColumnIds.push(id.childNodes[0].nodeValue);
          }
        })
      });
    }
    this.parseSpecificAttributes();
  }

  parseSpecificAttributes() {
    this.name = this.base.getValue('name');
    this.many = this.base.getValue('many') === 1;
    this.referencedTableId = this.base.getValue('referencedTable');
    this.deleteRule = this.base.getValue('deleteRule') === 1;
    this.updateRule = this.base.getValue('updateRule') === 1;
  }

  resolveColumns(columns) {
    _.forEach(this.columnIds, (id) => {
      if (columns && columns[id]) {
        this.columns.push(columns[id]);
      }
    });
  }

  resolveReferencedTableAndColumn(tables) {
    this.referencedTableName = '';
    this.referencedColumnIds = [];
    if (tables && tables[this.referencedTableId]) {
      const table = tables[this.referencedTableId];
      _.forEach(this.referencedColumnIds, (referencedColumnId) => {
        let column = table.getColumnById(referencedColumnId);
        if (column) {
          this.referencedColumns.push(column);
        }
      });
    }
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
   * @returns {Array<*>}
   */
  getColumns() {
    return this.columns;
  }

  /**
   * @return {Array<*>}
   */
  getReferenceColumns() {
    return this.referencedColumns;
  }

  /**
   * @return {String<*>}
   */
  getReferenceTableName() {
    return this.referencedTableName;
  }

  /**
   * @return {Boolean<*>}
   */
  hasMany() {
    return this.many;
  }
}

module.exports = ForeignKey;
