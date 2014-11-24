var fs = require(__dirname+'/../fs-ext.js');


var out = function(err, val) {
  console.log("Hallo");
  var item;
  for (item in val) {
    console.log(item+' '+val[item]);
  }
};

out(undefined, fs.statVFSSync(__dirname));
fs.statVFS(__dirname, out);
