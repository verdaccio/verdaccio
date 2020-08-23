let lunr = require('lunr');
let lunrMutable = require('./lunr-mutable.js');
let fs = require('fs');
let path = require('path');

let crypto = require('crypto');

function makeBuilder(lunr, lunrMutable) {
    let builder = new lunrMutable.Builder();
    builder.ref('title');

    builder.field('title');
    builder.field('tags');
    builder.field('text');

    builder.pipeline.reset();
    builder.pipeline.add(
        lunr.trimmer,
        lunr.stopWordFilter,
        lunr.stemmer
    );

    builder.searchPipeline.reset();
    builder.searchPipeline.add(
        lunr.stemmer
    );

    return builder;
}

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepCompare(lhs, rhs, path) {
  if(typeof(lhs) == 'object' && typeof(rhs) == 'object') {
    if(Array.isArray(lhs) && Array.isArray(rhs)) {
      if(lhs.length != rhs.length) {
        console.log(`values at ${path} differ in length`);
      } else {
        for(let i = 0; i < lhs.length; i++) {
          let newPath = path.slice();
          newPath.push(i);
          deepCompare(lhs[i], rhs[i], newPath);
        }
      }
    } else if(!Array.isArray(lhs) && !Array.isArray(rhs)) {
      let lhs_keys = Object.keys(lhs);
      let rhs_keys = Object.keys(rhs);

      for(let k of lhs_keys) {
          if(!Object.prototype.hasOwnProperty.call(rhs, k)) {
            console.log(`values at ${path} differ: RHS doesn't have key ${k}`);
            continue;
          }

          let newPath = path.slice();
          newPath.push(k);
          deepCompare(lhs[k], rhs[k], newPath);
      }

      for(let k of rhs_keys) {
        if(!Object.prototype.hasOwnProperty.call(lhs, k)) {
          console.log(`values at ${path} differ: LHS doesn't have key ${k}`);
          continue;
        }
      }

      // XXX FILL ME IN
    } else {
      console.log(`values at ${path} don't match (${lhs} vs ${rhs})`);
    }
  } else {
    if(lhs != rhs) {
      console.log(`values at ${path} don't match (${lhs} vs ${rhs})`);
    }
  }
}

function addTiddlers(builder, tiddlers) {
    // XXX why is this part so fast? (removal was slow and inaccurate)
    for(let tiddler of tiddlers) {
        let fields = {
          title: tiddler.title
        };
        if('text' in tiddler) {
            fields.text = tiddler.text;
        }
        builder.remove(fields);
        builder.add(fields);

        builder.remove(fields);
        builder.add(fields);
    }
}

let query = '+firefox +network';

let paths = fs.readdirSync('/tmp/samples/').map(p => path.join('/tmp/samples/', p));
let tiddlers = [];
for(let p of paths) {
  tiddlers.push(JSON.parse(fs.readFileSync(p)));
}

let builder = makeBuilder(lunr, lunrMutable);
addTiddlers(builder, tiddlers);

let index = builder.build();

for(let result of index.search(query)) {
    if(result.ref != '2017-08-25' && result.ref != '2017-06-22') {
        continue;
    }
    console.log(result.ref + "\t" + result.score);
}
