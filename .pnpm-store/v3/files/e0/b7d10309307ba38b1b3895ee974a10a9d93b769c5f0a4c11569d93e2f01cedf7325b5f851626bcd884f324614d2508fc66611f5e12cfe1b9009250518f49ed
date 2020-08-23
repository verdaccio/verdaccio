
const stringify = require('.')
const {StringDecoder} = require('string_decoder')

module.exports = function(records, options={}){
  const data = []
  if(Buffer.isBuffer(records)){
    const decoder = new StringDecoder()
    records = decoder.write(records)
  }
  const stringifier = new stringify.Stringifier(options)
  stringifier.push = function(record){
    if(record){
      data.push(record.toString())
    }
  }
  for(let record of records){
    stringifier.write(record) 
  }
  stringifier.end()
  return data.join('')
}
