//  iterate array pointer in both arrays to first matching element
//  savedArr: remove and copy all elements (e0) preceding match 
//  processedArr: insert (e0) before pointer
//  repeat
// 
//  if savedArr has elements remaining after loop complete, append to processedArr


let processedArr = ["r", "e", "\n", "d"]
// let savedArr = [
// "\033[34m", "r", "\033[0m",
// "\033[34m", "e", "\033[0m", 
// "\033[34m", "d", "\033[0m",
// ]
 

const ANSIPattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|');
const ANSIRegex = new RegExp(ANSIPattern, "g")
const ANSICloseRegex = new RegExp(`\\u001b\\[0m`)



let text = "\033[34mr\033[39m\033[33me\033[0m\033[34md\033[0m"

// get start and end positions for matches
let matches = []
while((result = ANSIRegex.exec(text)) !== null) {
  matches.push({
    start: result.index,
    end: result.index + result[0].length,
    match: result[0]
  })
}

// add start and end positions for non matches
matches = matches.reduce((prev, curr) => {
  // check if space exists between this and last match
  // get end of previous match
  let prevEnd = prev[prev.length -1]

  if (prevEnd.end < curr.start) {
    prev.push({ start: prevEnd.end, end: curr.start }, curr) 
  }
  else {
    prev.push(curr)
  }
  return prev
},[{start:0, end:0}])
  .splice(1) // removes starting accumulator object

// get regex pattern for each split point
let splitStr = matches.map( value => `(.{${value.end - value.start}})` )
  .join('')

// now we have an array of all ansi escaped and non-ansi escaped strings
let savedArr = new RegExp(`^${splitStr}`).exec(text).splice(1)


console.log(savedArr, processedArr)
// process.exit()


let restoredANSI = processedArr.map((char) => {
  if (char === '\n') return char

  let splicePoint = savedArr.findIndex(element => element === char) + 1
  let result = savedArr.splice(0, splicePoint)

  // add all consecutive closing tags 
  while (ANSICloseRegex.test(savedArr[0])){
    result.push(savedArr.shift())
  }

  return result.join("")
}).concat(savedArr)

console.log(restoredANSI)
console.log(restoredANSI.join(""))
