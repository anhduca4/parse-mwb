# parse-mwb

Parse file MySQL Workbench (Mwb to object) .


## Installation

```shell
npm install --save parse-mwb
yarn add parse-mwb
```

## Importing

```js
import ParseMwb from 'parse-mwb'; // ES6
const ParseMwb = require('parse-mwb'); // ES5 with npm
```


## Usage

```js
const ParseMwb = require('parse-mwb');

parse = async () => {
  const tables = await ParseMwb.parseAsync(path.join(__dirname, 'documents/db.mwb'));
  const data = [];
  const dataTables = tables.getTables();
  _.forEach(dataTables, (table) => {
    let x = {};
    x['name'] = table.getName();
    x['columns'] = [];
    _.forEach(table.getColums(), (column) => {
      let y = {};
      y['name'] = column.getName();
      y['id'] = column.getId();
      y['type'] = column.getType();
      x['columns'].push(y);
    });
    data.push(x);
  });
  console.log(data[1].columns[0]);
}
parse();
```
======= Happy done =======
