# breakword

Get index i.e. 0,1,2,... of the character where a word must be broken given it must
be wrapped within a certain length of spaces. 

Useful because javascript's String.length does not reflect the true width of emojis and wide characters.

## Installation

```
npm install breakword 
```

## Examples

1. To find the index of the character to break after if we want to limit our characters fit on a line 3 spaces wide.

```
var Breakword = require ("breakword");
var word = "打破我的角色三";
var breakIndex = Breakword(word,3); 
console.log(breakIndex) //0
```
The result here - 0 - means all the characters before index 0 (in this case only the character 打) can fit in a line 3 spaces long.

## Test

```bash
npm test
```

- Save new test results to test/test.json

```bash
npm --save run test
```

- Display test outputs only

```bash
npm --display run test
```

## Build

```bash
npm run-script build
```
