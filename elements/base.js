const xpath = require('xpath');

class Base {
  constructor(table){
    this.object = table;
    return this;
  }

  /**
   * Get value of element by id
   * 
   * @returns {String<*>}
   */
  getId() {
    return this.object.getAttribute('id');
  }

  /**
   * Get value of element
   * 
   * @param {*} key 
   * @param {*} defaultString 
   * @returns {String<*> | Int<*>}
   */

  getValue(key, defaultString){
    const element = xpath.select1('value[@key="' +key+ '"]', this.object);
    if (element && element.childNodes[0] && element.childNodes[0].nodeValue) {
      if (element.getAttribute('type') === 'int') {
        return parseInt(element.childNodes[0].nodeValue);
      }
      return element.childNodes[0].nodeValue;
    }
    return defaultString;
  }

  /**
   * Get link from mwb in table
   * 
   * @param {*} key 
   * @return {String<*>}
   */
  getLink(key){
    const element = xpath.select1('link[@key="' +key+ '"]', this.object);
    if (element && element.childNodes[0] && element.childNodes[0].nodeValue) {
      return element.childNodes[0].nodeValue;
    }
    return null;
  }
}

module.exports = Base;
