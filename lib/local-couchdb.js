
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

function delete_attachement_doc (docname, callback) {
	var sinopia = nano.db.use('sinopia');
	sinopia.get(docname, function (err, body) {
		if (!err) {
		   var rev = body._rev;
	       sinopia.destroy(docname, rev, function(err, body) {
      		  if (err)
      		      console.error (err);
      		  callback ();
		   });
		}
		else {
			callback();
		}
	});
}

module.exports.write_stream = function (name) {
	
	var stream = MyStreams.UploadTarballStream()

	fs.exists(name, function(exists) {
	    if (exists) return stream.emit('error', FSError('EEXISTS'))

        delete_attachement_doc (name, function () {
			var sinopia = nano.db.use('sinopia');
			stream.emit('open')
			stream.pipe(
					sinopia.attachment.insert(name, name, null, 'application/x-compressed', {"docType" : "tarball"} ) 
			)
			stream.emit('success')
        });
	});
	return stream
}

module.exports.delete_stream = function (name, callback) {
	var sinopia = nano.db.use('sinopia');
	sinopia.get(name, name, function(err, body){
		if(!err){
		 	// console.log('attempting to delete body.rev', body.rev);
		 	// console.log('attempting to delete body', body);
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
	  if (!err) {
	    body.rows.forEach(function(doc) {
	      console.log("local-couchdb.list_packages", [doc.key, doc.value]);
	    });
	  }else{
	  	console.error('list_packages error!!!', err);
	  }
	  callback(err, body.rows);
	});
}


module.exports.search_packages = function (q, callback) {
	var limit = 50;
	if (!q || !callback) {
		var err = new Error("Invalid query/callback");
		console.err(err);
		if (callback)
			callback (err);
	}
	query = {
			q: q,
			limit: limit,
			reduce: false,
			include_docs: true
		};
	var sinopia = nano.db.use('sinopia');
	sinopia.search ("search", "all", query, function (err, result){
		if (err) callback(err);
		else {
			var rows = [];
			try {
				if (typeof result === 'string') {
					var result = JSON.parse(result);
				}
				rows = result.rows;
			}
			catch (e) {
				console.log(new Error("Search result is not a JSON"));
			}
			callback (null, rows)
		}
	});	
}



var createDBIfNecessary = function (){
  	nano.db.create('sinopia', function(err, body) {
	  if (!err) {
	    console.log('database sinopia created!');
	     var sinopia = nano.db.use('sinopia');
	     // Index
		  sinopia.insert(
			  {
					"_id" : "_design/views",
					"views" : {
						"list_node_packages" : {
							"map" : function(doc) {
								var docType = doc['docType'];
								if (docType == 'package.json') {
									emit(doc['package']['name'], doc.timestamp);
								}
							}
						}
					}
				}, function (error, response) {
			});
		  
		  
		  
		  // Lucene
		  sinopia.insert(
				  {
					  _id: '_design/search',
						indexes: {
							all: {
								analyzer: {
									"name": "perfield",
									"default": "standard",
									"fields": {
										"name": "keyword"
									}},
								index: 'function(doc) { var val = []; function idx(o) { for (var p in o) { if (!Array.isArray(o[p])) { if (typeof o[p] !== "object") val.push(o[p]); else idx(o[p]); } } } if (doc.docType === "package.json") { idx(doc); index("default", val.join(" "), { "store": true }); if (doc["package"] && doc["package"].name) { index("name", doc["package"].name, { "store": true }); } } }'
							}
						}
				  }, function (error, response) {
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



