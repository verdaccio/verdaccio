// @flow

import _ from 'lodash';
import assert from 'assert';
import request from 'request';
import {IRequestPromise} from '../types';

const requestData = Symbol('smart_request_data');

export class PromiseAssert extends Promise<any> implements IRequestPromise{

  constructor(options: any) {
    super(options);
  }

  status(expected: number) {
    // $FlowFixMe
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

  body_ok(expected: any) {
    // $FlowFixMe
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      try {
        if (_.isRegExp(expected)) {
          assert(body.ok.match(expected), '\'' + body.ok + '\' doesn\'t match ' + expected);
        } else {
          assert.equal(body.ok, expected);
        }
        assert.equal(body.error, null);
      } catch(err) {
        selfData.error.message = err.message;
        throw selfData.error;
      }
      return body;
    }));
  }


  body_error(expected: any) {
    // $FlowFixMe
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      try {
        if (_.isRegExp(expected)) {
          assert(body.error.match(expected), body.error + ' doesn\'t match ' + expected);
        } else {
          assert.equal(body.error, expected);
        }
        assert.equal(body.ok, null);
      } catch(err) {
        selfData.error.message = err.message;
        throw selfData.error;
      }
      return body;
    }));
  }

  request(callback: any) {
    // $FlowFixMe
    callback(this[requestData].request);
    return this;
  }

  response(cb: any) {
    // $FlowFixMe
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      cb(selfData.response);
      return body;
    }));
  }

  send(data: any) {
    // $FlowFixMe
    this[requestData].request.end(data);
    return this;
  }

}

function injectResponse(smartObject: any, promise: Promise<any>): Promise<any> {
  // $FlowFixMe
  promise[requestData] = smartObject[requestData];
  return promise;
}


function smartRequest(options: any): Promise<any> {
  const smartObject: any = {};

  smartObject[requestData] = {};
  smartObject[requestData].error = Error();
  Error.captureStackTrace(smartObject[requestData].error, smartRequest);

  const promiseResult: Promise<any> = new PromiseAssert(function(resolve, reject) {
    // store request reference on symbol
    smartObject[requestData].request = request(options, function(err, res, body) {
      if (err) {
        return reject(err);
      }

      // store the response on symbol
      smartObject[requestData].response = res;
      resolve(body);
    });
  });

  return injectResponse(smartObject, promiseResult);
}

export default smartRequest;

