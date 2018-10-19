const fs = require('fs');
const _ = require('lodash');
const xpath = require('xpath');
const Base = require('./base');

class Columm {
  constructor(eColume){
    this.base = new Base(eColume);
    this.attributes = [];
    this.id = '';
    this.name = '';
    this.nullable = false;
    this.defaultValue = '';
    this.autoIncrement = false;
    this.type = '';
    this.length = 0;
    this.precision = 0;
    this.scale = 0;
    this.unsigned = false;
    this.parse();
  }

  /**
   * Parse to column
   * 
   * @return {Object<*>}
   */
  parse() {
    this.id = this.base.getId();
    this.parseFlags();
    this.parseSpecificAttributes();
    return this;
    // console.log(this.base.object);
  }

  /**
   * Parse flags
   * 
   */
  parseFlags() {
    this.unsigned = false;
    const flags = xpath.select('value[@key="flags"]', this.base.object);
    if (flags && Array.isArray(flags) && flags.length > 0) {
      _.forEach(flags, (flag) => {
        const values = xpath.select('value', flag);
        if (values && Array.isArray(values) && values.length > 0) {
          _.forEach(values, (value) => {
            if (value && value.childNodes && value.childNodes[0] && value.childNodes[0].nodeValue && value.childNodes[0].nodeValue === 'UNSIGNED') {
              this.unsigned = true;
            }
          });
        }
      });
    }
  }

  parseSpecificAttributes() {
    this.name = this.base.getValue('name');
    this.nullable = this.base.getValue('isNotNull') !== 1;
    this.defaultValue = this.base.getValue('defaultValue');
    this.autoIncrement = this.base.getValue('autoIncrement') > 0;
    this.length = this.base.getValue('length');
    this.precision = this.base.getValue('precision');
    this.scale = this.base.getValue('scale');
  }

  parseType() {
    const typeLink = this.base.getLink('simpleType');
    const types = _.split(typeLink, '.');
    this.type = _.last(types);
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
   * @returns {String<*>}
   */
  getType() {
    return this.type;
  }

  /**
   * @returns {Number<*>}
   */
  getLength() {
    return this.length;
  }

  /**
   * @returns {Number<*>}
   */
  getPrecision() {
    return this.precision;
  }

  /**
   * @returns {Number<*>}
   */
  getScale() {
    return this.scale;
  }

  /**
   * @returns {Number<*>}
   */
  getDefaultValue() {
    return this.defaultValue;
  }

  /**
   * @returns {Boolean<*>}
   */
  isNullable() {
    return this.nullable;
  }

  /**
   * @returns {Boolean<*>}
   */
  isUnsigned() {
    return this.unsigned;
  }

  /**
   * @returns {Boolean<*>}
   */
  getAutoincrement() {
    return this.autoIncrement;
  }
}

module.exports = Columm;
