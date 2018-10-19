const Parse = require('./parse');


class ParseMwb {

  static async parseAsync(path) {
    return await (new Parse(path)).parseTable();
  }
}
if (!ParseMwb.name) ParseMwb.name = "ParseMwb";

module.exports = ParseMwb;
