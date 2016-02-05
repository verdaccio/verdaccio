var fs   = require('fs')
var Path = require('path')

var HttpsAgent = require('agentkeepalive').HttpsAgent;
var myagent = new HttpsAgent({
    maxSockets: 50,
    maxKeepAliveRequests: 0,
    maxKeepAliveTime: 30000
  });

var request = require('sync-request');


var UTIL_TAG = 'sinopiaUtils';
var env = require('./config-bluemix')('UTIL_TAG');
var cloudantOptions = env.get('cloudant');

var user = cloudantOptions.account;
var pass = cloudantOptions.password;

var url     = 'https://'+ user +':'+ pass +'@' +  user +'.cloudant.com';

module.exports = LocalData

function LocalData(path) {
  var self = Object.create(LocalData.prototype)
  self.path = path

  // backwards compat for a period of time....
  try {
    var tmpData= JSON.parse(fs.readFileSync(self.path, 'utf8'))
    fs.unlinkSync(self.path); // delete it so this part does not get called anymore
    // post version
    tmpData._id = 'localdatacache'
    var res = request('POST', url +'/sinopia', {
      json:  tmpData
    });
    self.data = tmpData;
    return self;
  } catch(_) { /* ignore exception */   }
  // end of backwards compat

 
  self.data = _getLocalDataCache();
  return self;

}

LocalData.prototype.add = function(name) {
  console.log('local-data-couchdb add', name);
  this.data = _getLocalDataCache();

  if (this.data.list.indexOf(name) === -1) {
    this.data.list.push(name)
    this.sync()
  }
}

LocalData.prototype.remove = function(name) {
  console.log('local-data-couchdb remove', name);
  this.data = _getLocalDataCache();
  var i = this.data.list.indexOf(name)
  if (i !== -1) {
    this.data.list.splice(i, 1)
  }

  this.sync()
}

LocalData.prototype.get = function() {
  console.log('local-data-couchdb get', this.data);
  this.data = _getLocalDataCache();
  return this.data.list
}

LocalData.prototype.sync = function() {
  console.log('local-data-couchdb sync', this.data);
  var revision = this.data.rev;
  delete this.data.rev;
  if(revision){
   // update version
    var res = request('PUT', url +'/sinopia/localdatacache?rev='+ revision, {
        json:  this.data,
          'headers': {
          'Content-Type': 'application/json'
        }
    });
  }else{
    // create version
    this.data._id = 'localdatacache';
    var res = request('POST', url +'/sinopia', {
        json:  this.data,
          'headers': {
          'Content-Type': 'application/json'
        }
    });
  }
}


//module.exports.document_exists = document_exists;
function _getLocalDataCache() {
   var res = request('GET', url +'/sinopia/localdatacache', {});
    if(res.statusCode > 200){
      return { list: [] }
    }else{
      var localData =  JSON.parse(res.getBody('utf8') ) ;
      console.log('local-data-couchdb _getLocalDataCache', localData);
      return localData;
    }
  
}

