const Wcwidth = require("wcwidth")

module.exports = function(input, breakAtLength) {

  let str = input.toString()
  var charArr = [...str]
  var index = 0
  var indexOfLastFitChar = 0
  var fittableLength = 0

  while(charArr.length > 0) {

    var char = charArr.shift()
    var currentLength = fittableLength + Wcwidth(char)

    if(currentLength <= breakAtLength) {
      indexOfLastFitChar = index
      fittableLength = currentLength
      index++
    } else {
      break
    }
    
  }

  //break after this character
  return indexOfLastFitChar
}
