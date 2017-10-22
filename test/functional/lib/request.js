const assert = require('assert');
const request = require('request');
const requestData = Symbol('smart_request_data');
const _ = require('lodash');

export class PromiseAssert extends Promise {

  constructor(options) {
    super(options);
  }

  status(expected) {
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      try {
        assert.equal(selfData.response.statusCode, expected);
      } catch(err) {
        selfData.error.message = err.message;
        throw selfData.error;
      }
      return body;
    }));
  }

  body_ok(expected) {
    const self_data = this[requestData];

    return injectResponse(this, this.then(function(body) {
      try {
        if (_.isRegExp(expected)) {
          assert(body.ok.match(expected), '\'' + body.ok + '\' doesn\'t match ' + expected);
        } else {
          assert.equal(body.ok, expected);
        }
        assert.equal(body.error, null);
      } catch(err) {
        self_data.error.message = err.message;
        throw self_data.error;
      }
      return body;
    }));
  }


  body_error(expected) {
    const self_data = this[requestData];

    return injectResponse(this, this.then(function(body) {
      try {
        if (_.isRegExp(expected)) {
          assert(body.error.match(expected), body.error + ' doesn\'t match ' + expected);
        } else {
          assert.equal(body.error, expected);
        }
        assert.equal(body.ok, null);
      } catch(err) {
        self_data.error.message = err.message;
        throw self_data.error;
      }
      return body;
    }));
  }

  request(callback) {
    callback(this[requestData].request);
    return this;
  }

  response(cb) {
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      cb(selfData.response);
      return body;
    }));
  }

  send(data) {
    this[requestData].request.end(data);
    return this;
  }

}

function injectResponse(smartObject, promise) {
  promise[requestData] = smartObject[requestData];
  return promise;
}

function smartRequest(options) {
  const smartObject = {};

  smartObject[requestData] = {};
  smartObject[requestData].error = Error();
  Error.captureStackTrace(smartObject[requestData].error, smartRequest);  
  const result = new PromiseAssert(function(resolve, reject) {
    smartObject[requestData].request = request(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }

      // store the response on symbol
      smartObject[requestData].response = res;
      resolve(body);
    });
  });

  // console.log("--result->", result);

  return injectResponse(smartObject, result);
}

export default smartRequest;

