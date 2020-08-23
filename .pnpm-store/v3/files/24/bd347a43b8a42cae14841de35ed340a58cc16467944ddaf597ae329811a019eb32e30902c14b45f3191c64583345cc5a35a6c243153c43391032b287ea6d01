# tty-table 电传打字台

[![Build Status](https://travis-ci.org/tecfu/tty-table.svg?branch=master)](https://travis-ci.org/tecfu/tty-table) [![NPM version](https://badge.fury.io/js/tty-table.svg)](http://badge.fury.io/js/tty-table)

---

Display your data in a table using a terminal, browser, or browser console.

---

## [Examples](examples/)

[See here for complete example list](examples/)


### Terminal (Static)

[examples/styles-and-formatting.js](examples/styles-and-formatting.js)

![Static](https://cloud.githubusercontent.com/assets/7478359/15691679/07142030-273f-11e6-8f1e-25728d558a2d.png "Static Example") 

### Terminal (Streaming)

```
$ node examples/data/fake-stream.js | tty-table --format json --header examples/config/header.js
```

![Streaming](https://user-images.githubusercontent.com/7478359/51738817-47c25700-204d-11e9-9df1-04e478331658.gif "tty-table streaming example") 

- See the built-in help for the terminal version of tty-table with: 
```
$ tty-table -h
```

### Browser & Browser Console 

- [examples/browser-example.html](examples/browser-example.html)

![Browser Console Example](https://user-images.githubusercontent.com/7478359/74614563-cbcaff00-50e6-11ea-9101-5457497696b8.jpg "tty-table in the browser console") 

[Working Example in Browser](https://cdn.rawgit.com/tecfu/tty-table/master/examples/browser-example.html)

<br/>
<br/>

## API Reference 
<!--API-REF-->

<a name="new_Table_new"></a>
### Table(header ```array```, rows ```array```, options ```object```)

| Param | Type | Description |
| --- | --- | --- |
| [header](#header_options) | <code>array</code> | Per-column configuration. An array of objects, one object for each column. Each object contains properties you can use to configure that particular column. [See available properties](#header_options) |
| [rows](#rows_examples) | <code>array</code> | Your data. An array of arrays or objects. [See examples](#rows_examples) |
| [options](#options_properties) | <code>object</code> | Global table configuration. [See available properties](#options_properties) |


<br/>
<a name="header_options"></a>

#### header ```array of objects```

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>string</code> | Text to display in column header cell |
| align | <code>string</code> | default: "center" |
| color | <code>string</code> | default: terminal default color |
| footerAlign | <code>string</code> | default: "center" |
| footerColor | <code>string</code> | default: terminal default color |
| formatter | <code>function(cellValue, columnIndex, rowIndex, rowData, inputData)</code> | Runs a callback on each cell value in the parent column. <br/>Use `this.style` within function body to style text, i.e. `this.style("mytext", "bold", "green", "underline")`. <br/>Please note that fat arrow functions `() => {}` don't support scope overrides, and this feature won't work within them. For a full list of options, see: [kleur](https://github.com/lukeed/kleur).  |
| headerAlign | <code>string</code> | default: "center" |
| headerColor | <code>string</code> | default: terminal's default color |
| marginLeft | <code>integer</code> | default: 0 |
| marginTop | <code>integer</code> | default: 0 |
| width | <code>string</code> \|\| <code>integer</code> | default: "auto" |
| paddingBottom | <code>integer</code> | default: 0 |
| paddingLeft | <code>integer</code> | default: 1 |
| paddingRight | <code>integer</code> | default: 1 |
| paddingTop | <code>integer</code> | default: 0 |
| value | <code>string</code> | Name of the property to display in each cell when data passed as an array of objects |


**Example**

```js
let header = [{
  value: "item",
  headerColor: "cyan",
  color: "white",
  align: "left",
  width: 20
},
{
  value: "price",
  color: "red",
  width: 10,
  formatter: function (value) {
    let str = `$${value.toFixed(2)}`
    return (value > 5) ? this.style(str, "green", "bold") : 
      this.style(str, "red", "underline")
  }
}]
```

<br/>
<br/>
<a name="rows_examples"></a>

#### rows ```array```

**Example**
- each row an array
```js
const rows = [
  ["hamburger",2.50],
]
```
- each row an object
```js
const rows = [
  {
    item: "hamburger",
    price: 2.50
  }
]
```


<br/>
<br/>
<a name="footer_example"></a>

#### footer ```array```
- Footer is optional

**Example**
```js
const footer = [
  "TOTAL",
  function (cellValue, columnIndex, rowIndex, rowData) {
    let total = rowData.reduce((prev, curr) => {
      return prev + curr[1]
    }, 0)
    .toFixed(2)

    return this.style(`$${total}`, "italic")
  }
]
``` 

<br/>
<br/>
<a name="options_properties"></a>

#### options ```object```

| Param | Type | Description |
| --- | --- | --- |
| borderStyle | <code>string</code> | default: "solid".  "solid", "dashed", "none" |
| borderColor | <code>string</code> | default: terminal default color |
| color | <code>string</code> | default: terminal default color |
| compact | <code>boolean</code> | default: false Removes horizontal lines when true. |
| defaultErrorValue | <code>mixed</code> | default: '�' |
| defaultValue | <code>mixed</code> | default: '?' |
| errorOnNull | <code>boolean</code> | default: false |
| truncate | <code>mixed</code> | default: false <br/> When this property is set to a string, cell contents will be truncated by that string instead of wrapped when they extend beyond of the width of the cell.  <br/> For example if: <br/> <code>"truncate":"..."</code> <br/> the cell will be truncated with "..." |

**Example**
```js
const options = {
  borderStyle: 1,
  borderColor: "blue",
  headerAlign: "center",
  align: "left",
  color: "white",
  truncate: "..."
}
```

<br/>

### Table.render() ⇒ <code>String</code>
<a name="Table.tableObject.render"></a>

Add method to render table to a string

**Example**  
```js
const out = Table(header,rows,options).render()
console.log(out); //prints output
```

<!--END-API-REF-->

<br/>
<br/>

## Installation

- [Terminal](docs/terminal.md):

```sh
$ npm install tty-table -g
```

- Node Module

```sh
$ npm install tty-table
```

- Browser

```html
import Table from './dist/tty-table.esm.js'

// other options:
// let Table = require('tty-table')   // dist/tty-table.cjs.js
// let Table = TTY_Table;             // dist/tty-table.umd.js
```


## Running tests

```sh
$ npm test
```

## Saving the output of new unit tests 

```sh
$ npm run save-tests
```
- Because: 

`node script.js --color=always`

## Dev Tips

- To generate vim tags (make sure [jsctags](https://github.com/ramitos/jsctags) is installed globally)

```sh
$ npm run tags
```

- To generate vim tags on file save 

```sh
$ npm run watch-tags
```

## Pull Requests

Pull requests are encouraged!

- Please remember to add a unit test when necessary
- Please format your commit messages according to the ["Conventional Commits"](https://www.conventionalcommits.org/en/v1.0.0/) specification

If you aren't familiar with Conventional Commits, here's a good [article on the topic](https://dev.to/maniflames/how-conventional-commits-improved-my-git-skills-1jfk)

TL/DR:

- feat: a feature that is visible for end users.
- fix: a bugfix that is visible for end users.
- chore: a change that doesn't impact end users (e.g. chances to CI pipeline)
- docs: a change in the README or documentation
- refactor: a change in production code focused on readability, style and/or performance.


## [Packaging as a distributable](packaging.md)


## License

[MIT License](https://opensource.org/licenses/MIT)

Copyright 2015-2020, Tecfu. 
