'use strict';

const Tests = {};
const fs = require('fs'); 
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const breakword = require(__dirname+'/../src/main.js');
//get npm arg
const ARG = JSON.parse(process.env.npm_config_argv)['original'][0]

let testResultFilepath = __dirname+'/tests.json';
let test = function(testResult,correctResult,word,width){
  it(
    `The string "${word}" must break after the character at index ${correctResult} to fit within a line of ${width} width`,
    function(){
      testResult.should.equal(correctResult);
    }
  )
};

//get test list
let str = fs.readFileSync(testResultFilepath,{
  encoding : 'utf-8'
});

let obj = JSON.parse(str);

for(let i in obj){  
  
  let testResult = breakword(obj[i].input, obj[i].width);

  console.log("Test Properties:",obj[i]);
  console.log("12345678901234567890");
  console.log("BEGIN---------------");
  console.log(obj[i].input);
  console.log(testResult);
  console.log("END-----------------\n");


  switch(true){
    case(ARG === '--save'):
    //save tests
      obj[i].output = testResult;
      break;
    case(ARG === '--display'):
    //show tests (do nothing)
      console.log("--- ONLY DISPLAYING EXECUTION RESULTS, TESTS NOT RUN AGAINST SAVED RESULTS!!! ---")
      break;
    default:
    //run tests
      describe('Test '+i,function(){
        test(testResult,obj[i].correctResult,obj[i].input,obj[i].width);
      })
  }
}

if(ARG === '--save'){
  //write saved object to file
  fs.writeFileSync(testResultFilepath,JSON.stringify(obj,null,2),'utf8');
  console.log("Execution results saved to file.");
}

module.exports = Tests;
