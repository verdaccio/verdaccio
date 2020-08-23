const stripAnsi = require("strip-ansi")
const smartwrap = require("smartwrap")
const wcwidth = require("wcwidth")


module.exports.calculateLength = line => {
  // return stripAnsi(line.replace(/[^\x00-\xff]/g,'XX')).length
  return wcwidth(stripAnsi(line))
}


module.exports.wrapCellContent = (
  config,
  cellValue,
  columnIndex,
  cellOptions,
  rowType
) => {

  // ANSI chararacters that demarcate the start/end of a line
  const startAnsiRegexp = /^(\033\[[0-9;]*m)+/
  const endAnsiRegexp = /(\033\[[0-9;]*m)+$/

  // coerce cell value to string
  let string = cellValue.toString()

  // store matching ANSI characters
  let startMatches = string.match(startAnsiRegexp) || [""]

  // remove ANSI start-of-line chars
  string = string.replace(startAnsiRegexp, "")

  // store matching ANSI characters so can be later re-attached
  let endMatches = string.match(endAnsiRegexp) || [""]

  // remove ANSI end-of-line chars
  string = string.replace(endAnsiRegexp, "")

  let alignTgt

  switch(rowType) {
    case("header"):
      alignTgt = "headerAlign"
      break
    case("body"):
      alignTgt = "align"
      break
    default:
      alignTgt = "footerAlign"
  }

  // equalize padding for centered lines
  if(cellOptions[alignTgt] === "center") {
    cellOptions.paddingLeft = cellOptions.paddingRight = Math.max(
      cellOptions.paddingRight,
      cellOptions.paddingLeft,
      0
    )
  }

  const columnWidth = config.table.columnWidths[columnIndex]

  // innerWidth is the width available for text within the cell
  const innerWidth = columnWidth
    - cellOptions.paddingLeft
    - cellOptions.paddingRight
    - config.GUTTER

  if(typeof config.truncate === "string") {
    string = exports.truncate(string, cellOptions, innerWidth)
  } else {
    string = exports.wrap(string, cellOptions, innerWidth)
  }

  // format each line
  let strArr = string.split("\n").map( line => {
    line = line.trim()

    const lineLength = exports.calculateLength(line)

    // alignment
    if(lineLength < columnWidth) {
      let emptySpace = columnWidth - lineLength

      switch(true) {
        case(cellOptions[alignTgt] === "center"):
          emptySpace --
          let padBoth = Math.floor(emptySpace / 2),
            padRemainder = emptySpace % 2
          line = Array(padBoth + 1).join(" ")
            + line
            + Array(padBoth + 1 + padRemainder).join(" ")
          break

        case(cellOptions[alignTgt] === "right"):
          line = Array(emptySpace - cellOptions.paddingRight).join(" ")
            + line
            + Array(cellOptions.paddingRight + 1).join(" ")
          break

        default:
          line = Array(cellOptions.paddingLeft + 1).join(" ")
            + line
            + Array(emptySpace - cellOptions.paddingLeft).join(" ")
      }
    }

    // put ANSI color codes BACK on the beginning and end of string
    return startMatches[0] + line + endMatches[0]
  })

  return {
    output: strArr,
    width: innerWidth
  }
}


module.exports.truncate = (string, cellOptions, maxWidth) => {
  const stringWidth = wcwidth(string)

  if(maxWidth < stringWidth) {
    // @todo give use option to decide if they want to break words on wrapping
    string = smartwrap(string, {
      width: maxWidth - cellOptions.truncate.length,
      breakword: true
    }).split("\n")[0]
    string = string + cellOptions.truncate
  }

  return string
}


module.exports.wrap = (string, cellOptions, innerWidth) => {
  let outstring = smartwrap(string, {
    errorChar: cellOptions.defaultErrorValue,
    minWidth: 1,
    trim: true,
    width: innerWidth
  })

  return outstring
}


/**
 * Returns the widest cell give a collection of rows
 *
 * @param array rows
 * @param integer columnIndex
 * @returns integer
 */
module.exports.inferColumnWidth = (columnOptions, rows, columnIndex) => {

  let iterable
  let widest = 0

  // add a row that contains the header value, so we use that width too
  if(typeof columnOptions === "object" && columnOptions.value) {
    iterable = rows.slice()
    let z = new Array(iterable[0].length) // create a new empty row
    z[columnIndex] = columnOptions.value.toString()
    iterable.push(z)
  } else {
    // no header value, just use rows to derive max width
    iterable = rows
  }

  iterable.forEach( row => {
    if(row[columnIndex] && row[columnIndex].toString().length > widest) {
      widest = wcwidth(row[columnIndex].toString())
    }
  })

  return widest
}


module.exports.getColumnWidths = (config, rows) => {

  // iterate over the header if we have it, iterate over the first row
  // if we do not (to step through the correct number of columns)
  let iterable = (config.table.header[0] && config.table.header[0].length > 0)
    ? config.table.header[0] : rows[0]

  let widths = iterable.map((column, columnIndex) => {
    let result

    switch(true) {
      // column width specified in header
      case(typeof column === "object" && typeof column.width === "number"):
        result = column.width
        break

      // global column width set in config
      case(config.width && config.width !== "auto"):
        result = config.width
        break

      default:
      // 'auto' sets column width to longest value in initial data set
        let columnOptions = (config.table.header[0][columnIndex])
          ? config.table.header[0][columnIndex] : {}
        let measurableRows = (rows.length) ? rows : config.table.header[0]
        result = exports.inferColumnWidth(columnOptions, measurableRows, columnIndex)

        // add spaces for padding if not centered
        result = result + config.paddingLeft + config.paddingRight
    }

    // add space for gutter
    result = result + config.GUTTER

    return result
  })

  // calculate sum of all column widths (including marginLeft)
  let totalWidth = widths.reduce((prev, curr) => prev + curr)

  // if sum of all widths exceeds viewport, resize proportionately to fit
  if(process && process.stdout && totalWidth > process.stdout.columns) {
    // recalculate proportionately to fit
    let prop = (process.stdout.columns - config.marginLeft) / totalWidth

    prop = prop.toFixed(2) - 0.01

    // when process.stdout.columns is 0, width will be negative
    if (prop > 0) {
      widths = widths.map(value => Math.floor(prop * value))
    }
  }

  return widths
}
