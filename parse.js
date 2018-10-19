const fs = require('fs-extra');
const os = require('os');
const _ = require('lodash');
const extract = require('extract-zip');
const path = require('path');
const xpath = require('xpath');
const dom   = require('xmldom').DOMParser;
const Table = require('./elements/table');

class Parse {

  constructor(path){
    this.path = path;
    this.tempDirectory = '';
    this.tables = [];
  }

  async parseTable() {
    const statusExtractArchive = await this.extractArchive(this.path);
    if (statusExtractArchive) {
      this.parseXml();
    }
    return this;
  }

  async parseXml() {
    const xml = fs.readFileSync(this.tempDirectory + '/document.mwb.xml', 'utf8').toString();
    const domData = new dom().parseFromString(xml);
    const nodeTables = xpath.select('//value[@struct-name="db.mysql.Table"]', domData);
    this.tables = [];
    const tableIds = {};
    _.forEach(nodeTables, (eTable, index) => {
      let dataTable = new Table(eTable);
      this.tables.push(dataTable);
      tableIds[dataTable.getId()] = tableIds;
    });
    _.forEach(this.tables, (table) => {
      table.resolveForeignKeyReference(tableIds);
    });
    try{
      fs.remove(this.tempDirectory + '/document.mwb.xml');
    } catch (e) {
      console.log(e);
    }
  }

  async extractArchive(pathFile) {
    if (!fs.existsSync(pathFile)) {
      return false;
    }
    const tempDirectory = await this.getTemporaryPath();
    const promiseExtractFile = await new Promise((resolve, reject) => {
      extract(pathFile, {dir: tempDirectory}, (e) => {
        if (e) {
          resolve(false);
        }
        resolve(true);
      });
    });
    return promiseExtractFile;
  }

  getTemporaryPath(){
    const tempDirectory = os.tmpdir() + '/mwb';
    try{
      fs.removeSync(tempDirectory);
    } catch (e) {
      console.log(e);
    }
    fs.mkdirSync(tempDirectory);
    this.tempDirectory = tempDirectory;
    return tempDirectory;
  }

  getTables() {
    return this.tables;
  }
}
if (!Parse.name) Parse.name = "ParseMwb";

module.exports = Parse;
