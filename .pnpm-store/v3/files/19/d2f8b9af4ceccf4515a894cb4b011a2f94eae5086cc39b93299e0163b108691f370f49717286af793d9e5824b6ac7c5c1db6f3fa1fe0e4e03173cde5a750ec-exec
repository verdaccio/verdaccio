#!/usr/bin/env node
const path = require("path")
const fs = require("fs")
const csv = require("csv")
const chalk = require("chalk")
let yargs = require("yargs")

yargs.epilog("Copyright github.com/tecfu 2018")

yargs.option("config", {
  describe: "Specify the configuration for your table."
})

yargs.option("csv-delimiter", {
  describe: "Set the field delimiter. One character only.",
  default: ","
})

yargs.option("csv-escape", {
  describe: "Set the escape character. One character only."
})

yargs.option("csv-rowDelimiter", {
  describe: "String used to delimit record rows. You can also use a special constant: \"auto\",\"unix\",\"max\",\"windows\",\"unicode\".",
  default: "\n"
})

yargs.option("format", {
  describe: "Set input data format",
  choices: ["json", "csv"],
  default: "csv"
})

yargs.option("options\u2010\u002A", {
  describe: "Specify an optional setting where * is the setting name. See README.md for a complete list."
})

// run help only at the end
yargs = yargs.help("h").argv

let emitError = function(type, detail) {
  console.log(`\n${  chalk.bgRed.white(type)  }\n\n${  chalk.bold(detail)}`)
  process.exit(1)
}

// note that this is the first run
let alreadyRendered = false
let previousHeight = 0

let dataFormat = "csv"
switch(true) {
  case(typeof yargs.format === "undefined"):
    break
  case(yargs.format.toString().match(/json/i) !== null):
    dataFormat = "json"
    break
  default:
}

// look for individually flagged options-*
let options = {}
Object.keys(yargs).forEach(function(key) {
  let keyParts = key.split("-")
  if(keyParts[0]==="options") {
    options[keyParts[1]]=yargs[key]
  }
})

// look for options passed via config file
let header = []
if(yargs.header) {
  if(!fs.existsSync(path.resolve(yargs.header))) {
    emitError(
      "Invalid file path",
      `Cannot find config file at: ${  yargs.header  }.`
    )
  }
  // merge with any individually flagged options
  header = require(path.resolve(yargs.header))
}

// because different dataFormats
let runTable = function(header, body) {

  // footer = [],
  let Table = require("../src/factory.js")
  options.terminalAdapter = true
  let t1 = Table(header, body, options)

  // hide cursor
  console.log("\u001b[?25l")

  // wipe existing if already rendered
  if(alreadyRendered) {

    // move cursor up number to the top of the previous print
    // before deleting
    console.log(`\u001b[${previousHeight+3}A`)

    // delete to end of terminal
    console.log("\u001b[0J")
  } else{
    alreadyRendered = true
  }

  console.log(t1.render())

  // reset the previous height to the height of this output
  // for when we next clear the print
  previousHeight = t1.height

}

process.stdin.resume()
process.stdin.setEncoding("utf8")
process.stdin.on("data", function(chunk) {

  // handle dataFormats
  switch(true) {
    case(dataFormat==="json"):
      let data
      try {
        data = JSON.parse(chunk)
      } catch(e) {
        emitError(
          "JSON parse error",
          "Please check to make sure that your input data consists of JSON or specify a different format with the --format flag."
        )
      }
      runTable(header, data)
      break
    default:
      let formatterOptions = {}
      Object.keys(yargs).forEach(function(key) {
        if(key.slice(0, 4) === "csv-" && typeof(yargs[key]) !== "undefined") {
          formatterOptions[key.slice(4)] = yargs[key]
        }
      })

      csv.parse(chunk, formatterOptions, function(err, data) {
      // validate csv
        if(typeof data === "undefined") {
          emitError(
            "CSV parse error",
            "Please check to make sure that your input data consists of valid comma separated values or specify a different format with the --format flag."
          )
        }
        runTable(header, data)
      })
  }
})

/* istanbul ignore next */
if (process.platform === "win32") {
  let rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on("SIGINT", function () {
    process.emit("SIGINT")
  })
}

/* istanbul ignore next */
process.on("SIGINT", function () {
  // graceful shutdown
  process.exit()
})

process.on("exit", function() {
  // show cursor
  console.log("\u001b[?25h")
})
