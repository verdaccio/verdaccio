# smartwrap

[![Build Status](https://travis-ci.org/tecfu/smartwrap.svg?branch=master)](https://travis-ci.org/tecfu/smartwrap) [![Dependency Status](https://david-dm.org/tecfu/smartwrap.png)](https://david-dm.org/tecfu/smartwrap) [![NPM version](https://badge.fury.io/js/smartwrap.svg)](http://badge.fury.io/js/smartwrap)

Textwrap for javascript/nodejs. Correctly handles wide characters (宽字符) and emojis (😃). Optionally break words when wrapping strings.
## Why? 

I needed a javascript package to correctly wrap wide characters - which have a "length" property value of 1 but occupy 2 or more spaces in the terminal.

## Example Usages:

### Terminal:
```sh
npm i -g smartwrap
echo somestring you want to wrap | smartwrap --width=3 --paddingLeft=1
```

#### Output:
```
 so
 me
 st
 ri
 ng
 yo
 u
 wa
 nt
 to
 wr
 ap
```

## Node module:

### Wide Character Wrapping

```js
var Smartwrap = require('smartwrap');
var exampleText1 = '宽字符';
console.log(Smartwrap(exampleText1,{
  width: 2
}));
```

- Output:
```
宽
字
符
```

### String Wrapping

```js
let exampleText2 = "break at word"

console.log(smartwrap(exampleText2,{
  width: 10,
  breakword: false //default
}))
```

- Output:

```
break at
word
```

### Breaking Words When Wrapping Strings

```js
console.log(smartwrap(exampleText2,{
  width: 10,
  breakword: true
}))
```

- Output:

```
break at w
ord
```

## Options

```sh
--breakword       Choose whether or not to break words when wrapping a string
                                                                 [default: false]
--errorChar       Placeholder for wide characters when minWidth < 2
                                                                 [default: �]
--minWidth        Never change this unless you are certin you are not using
                  wide characters and you want a column 1 space wide. Then
                  change to 1.                   [choices: 1, 2] [default: 2]
--paddingLeft     Set the left padding of the output             [default: 0]
--paddingRight    Set the right padding of the output            [default: 0]
--splitAt         Characters at which to split input    [default: [" ","\t"]]
--trim            Trim the whitespace from end of input       [default: true]
--width, -w       Set the line width of the output (in spaces)
                                                     [required] [default: 10]
```

## Compatibility 

node 4.0 <

## License

[GPL 2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

