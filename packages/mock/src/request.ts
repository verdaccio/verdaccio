import _ from 'lodash';
import assert from 'assert';
import fetch, { RequestInit } from 'node-fetch';
import { IRequestPromise } from './types';

const requestData = Symbol('smart_request_data');

export class PromiseAssert extends Promise<any> implements IRequestPromise {

  public constructor(options: any) {
    super(options);
  }

  public status(expected: number) {
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      try {
        assert.equal(selfData.response.status, expected);
      } catch(err) {
        selfData.error.message = err.message;
        throw selfData.error;
      }
      return body;
    }));
  }

  public body_ok(expected: any) {
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


  public body_error(expected: any) {
    
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

  public request(callback: any) {
    callback(this[requestData].request);
    return this;
  }

  public response(cb: any) {
    const selfData = this[requestData];

    return injectResponse(this, this.then(function(body) {
      cb(selfData.response);
      return body;
    }));
  }

  public send(data: any) {
    this[requestData].request.end(data);
    return this;
  }

}

function injectResponse(smartObject: any, promise: Promise<any>): Promise<any> {
  
  promise[requestData] = smartObject[requestData];
  return promise;
}


function smartRequest(url:string,options: RequestInit): Promise<any> {
  const smartObject: any = {};

  smartObject[requestData] = {};
  smartObject[requestData].error = Error();
  Error.captureStackTrace(smartObject[requestData].error, smartRequest);

  const promiseResult: Promise<any> = new PromiseAssert(function(resolve, reject) {
    smartObject[requestData].request = fetch(url, options).then(async response => {
      const jsonResponse = await response.json();
      if(response.ok){
        resolve(jsonResponse);
        smartObject[requestData].response = response;
      } else {
        reject(jsonResponse);
      }
    }).catch((error) => {
      reject(error);
    });
  });

  return injectResponse(smartObject, promiseResult);
}

export default smartRequest;

