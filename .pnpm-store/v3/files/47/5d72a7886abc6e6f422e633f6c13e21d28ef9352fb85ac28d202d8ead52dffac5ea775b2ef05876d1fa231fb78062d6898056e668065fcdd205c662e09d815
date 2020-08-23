const chalk = require("chalk")


module.exports.color = (str, ...colors) => {
  return colors.reduce(function(input, color) {
    return chalk[color](input)
  }, str)
}

module.exports.colorizeCell = (str, cellOptions, rowType) => {

  let color = false // false will keep terminal default

  switch(true) {
    case(rowType === "body"):
      color = cellOptions.color || color
      break

    case(rowType === "header"):
      color = cellOptions.headerColor || color
      break

    default:
      color = cellOptions.footerColor || color
  }

  if (color) {
    str = exports.color(str, color)
  }

  return str
}
