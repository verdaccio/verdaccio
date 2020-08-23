#!/usr/bin/env node
"use strict"

let Smartwrap = require("./main.js")
let yargs = require("yargs")
yargs.option("breakword", {
  default: false,
  describe: "Choose whether or not to break words when wrapping a string"
})
yargs.option("errorChar", {
  default: "�",
  describe: "Placeholder for wide characters when minWidth < 2"
})
yargs.option("minWidth", {
  choices: [1, 2],
  default: 2,
  describe: "Never change this unless you are certin you are not using wide characters and you want a column 1 space wide, then change to 1"
})
yargs.option("paddingLeft", {
  default: 0,
  describe: "Set the left padding of the output"
})
yargs.option("paddingRight", {
  default: 0,
  describe: "Set the right padding of the output"
})
yargs.option("splitAt", {
  default: [" ", "\t"],
  describe: "Characters at which to split input"
})
yargs.option("trim", {
  default: true,
  describe: "Trim the whitespace from end of input"
})
yargs.option("width", {
  alias: "w",
  default: 10,
  describe: "Set the line width of the output (in spaces)",
  demandOption: true,
  coerce: function(arg) {
    if(isNaN(arg*1)) {
      throw new Error("Invalid width specified.")
    }
    return arg*1
  }
})

// create options object
let options = {};
[
  "minWidth",
  "paddingLeft",
  "paddingRight",
  "splitAt",
  "trim",
  "width"
].forEach(function(key) {
  if(typeof yargs.argv[key] !== "undefined") {
    options[key] = yargs.argv[key]
  }
})

process.stdin.resume()
process.stdin.setEncoding("utf8")
process.stdin.on("data", function(chunk) {
  let out = Smartwrap(chunk, options)
  console.log(out)
})

// yargs = yargs('h').argv;
yargs.argv = yargs.help("h").argv
