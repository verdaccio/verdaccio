
var MyStreams = require('./streams')
var Error     = require('http-errors')

var HttpsAgent = require('agentkeepalive').HttpsAgent;
var myagent = new HttpsAgent({
    maxSockets: 50,
    maxKeepAliveRequests: 0,
    maxKeepAliveTime: 30000
  });

var UTIL_TAG = 'sinopiaUtils';
var env = require('./config-bluemix')('UTIL_TAG');
var cloudantOptions = env.get('cloudant');

var user = cloudantOptions.account;
var pass = cloudantOptions.password;


var nano      = require('nano')({
									'url' : 'https://'+ user +':'+ pass +'@' +  user +'.cloudant.com',
									"requestDefaults" : { "agent" : myagent }	
								}
								);
var fs         = require('fs')

function NanoError(code) {
  var err = Error(code)
  err.code = code
  return err
}

module.exports.create_json = create_json;

function create_json (name, value, cb) {
  document_exists(value.name, function(err, headers){
  		if(err && err.statusCode == 404){
  			write_json(name, value, /*revision*/ null, cb);
  		}else{
  			cb( NanoError(409) )
  		}
  });
}

module.exports.update_json = function(name, value, cb) {
  read_json(name, function(err, body){
	if(headers.statusCode != 404){
		write_json(name, value, body["_rev"], cb);
	}else{
		cb( NanoError(404) )
	}
  });
}

module.exports.delete_json = delete_json;
function delete_json (data, cb) {
  var self = this
  var sinopia = nano.db.use('sinopia');
  sinopia.destroy(data.package.name, data["_rev"] , function(err, body, header) {
    if (!err) {
      console.log('[local-couchdb.delete_json] ', [body]);
      return cb() ;
    }else{
    	return cb();
    }
  });
}


module.exports.write_json = write_json;
function write_json (name, value, revision, cb) {
  var self = this
  var sinopia = nano.db.use('sinopia');
  var payload = { "_id": value.name, "timestamp" :  Date.now(),  "package": value, "docType" : "package.json"};
  if(revision){
  	payload ["_rev"] = revision;		//update code flow
  }

  sinopia.insert( payload , function(err, body, header) {
    if (!err) {
      return cb() ;
    }else{
    	return cb();
    }
  });
}

module.exports.read_json = function(name, cb) {
 
  var self = this;
   self.document_exists(name, function(err, headers){
		if(err && err.statusCode == 404){
			cb( NanoError('ENOENT') );
		}else{
		  var sinopia = nano.db.use('sinopia');
		  sinopia.get(name, function(err, body) {
		    if (err) {
		      cb( NanoError('ENOENT') )
		    }else{
		      cb(err, body)
		    }
		  });
		}
	});
}

module.exports.read_stream = function (name, stream, callback) {
	var sinopia = nano.db.use('sinopia');
	var stream = MyStreams.ReadTarballStream()
	var self = this;
	sinopia.attachment.get(name, name, function(err, body){
		if(err){
			stream.emit('error', Error[404]('no such file available'))
		 }else{
			stream.emit('open')
			stream.emit('content-length', body?body.length:-1)
			stream.end(body);
		}
	});
	return stream;
}

module.exports.write_stream = function (name) {
	
	var stream = MyStreams.UploadTarballStream()

	fs.exists(name, function(exists) {
	    if (exists) return stream.emit('error', FSError('EEXISTS'))
		var sinopia = nano.db.use('sinopia');
		
		stream.emit('open')
		stream.pipe(
				sinopia.attachment.insert(name, name, null, 'application/x-compressed', {"docType" : "tarball"} ) 
		)
		
		stream.emit('success')
	});
	return stream
}

module.exports.delete_stream = function (name, callback) {
	var sinopia = nano.db.use('sinopia');
	sinopia.get(name, name, function(err, body){
		if(!err){
			sinopia.destroy(name,
			    body._rev, function(err, body) {
			});
		}
		if(callback){
			return callback();
		}
	});
}




module.exports.document_exists = document_exists;

function document_exists (name, cb) {
  var sinopia = nano.db.use('sinopia');
  sinopia.head(name, function(err, _, headers) {
    if(cb){
      cb(err, headers);
    }
  });
}

module.exports.list_packages = list_packages;
function list_packages (callback) {
  	var sinopia = nano.db.use('sinopia');
  	sinopia.view('nodepackages', 'list_node_packages', function(err, body) {
  		if(body && body.rows){
	  		callback(err, body.rows);
	  	}else{
	  		callback(err, {});
	  	}
	});
}


var createDBIfNecessary = function (){
  	nano.db.create('sinopia', function(err, body) {
	  if (!err) {
	     var sinopia = nano.db.use('sinopia');
		  sinopia.insert(
		  { "views": 
		    { "list_node_packages": 
		      { "map": function (doc){  var docType = doc['docType'];     if(docType == 'package.json'){        emit ( doc['package']['name'], doc.timestamp  );     }} } 
		    }
		  }, '_design/nodepackages', function (error, response) {
	     });
	  }
	});
}


module.exports.unlink = function (filename, callback) {
	// required API when we were using filesystem calls
	if(callback){
		return callback();
	}
}

createDBIfNecessary();



