import assert from 'assert';

import _ from 'lodash';
import request from 'request';

const requestData = Symbol('smart_request_data');

export interface RequestPromise {
  status(reason: any): any;
  body_ok(reason: any): any;
  body_error(reason: any): any;
  request(reason: any): any;
  response(reason: any): any;
  send(reason: any): any;
}

function injectResponse(smartObject: any, promise: Promise<any>): Promise<any> {
  // $FlowFixMe
  promise[requestData] = smartObject[requestData];
  return promise;
}

export class PromiseAssert extends Promise<any> implements RequestPromise {
  public constructor(options: any) {
    super(options);
  }

  public status(expected: number) {
    const selfData = this[requestData];

    return injectResponse(
      this,
      this.then(function(body) {
        try {
          assert.equal(selfData.response.statusCode, expected);
        } catch (err) {
          selfData.error.message = err.message;
          throw selfData.error;
        }
        return body;
      })
    );
  }

  public body_ok(expected: any) {
    const selfData = this[requestData];

    return injectResponse(
      this,
      this.then(function(body) {
        try {
          if (_.isRegExp(expected)) {
            assert(body.ok.match(expected), "'" + body.ok + "' doesn't match " + expected);
          } else {
            assert.equal(body.ok, expected);
          }
          assert.equal(body.error, null);
        } catch (err) {
          selfData.error.message = err.message;
          throw selfData.error;
        }

        return body;
      })
    );
  }

  public body_error(expected: any) {
    // $FlowFixMe
    const selfData = this[requestData];

    return injectResponse(
      this,
      this.then(function(body) {
        try {
          if (_.isRegExp(expected)) {
            assert(body.error.match(expected), body.error + " doesn't match " + expected);
          } else {
            assert.equal(body.error, expected);
          }
          assert.equal(body.ok, null);
        } catch (err) {
          selfData.error.message = err.message;
          throw selfData.error;
        }
        return body;
      })
    );
  }

  public request(callback: any) {
    callback(this[requestData].request);
    return this;
  }

  public response(cb: any) {
    const selfData = this[requestData];

    return injectResponse(
      this,
      this.then(function(body) {
        cb(selfData.response);
        return body;
      })
    );
  }

  public send(data: any) {
    this[requestData].request.end(data);
    return this;
  }
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
