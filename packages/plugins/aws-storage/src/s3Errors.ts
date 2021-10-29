import { AWSError } from 'aws-sdk';

import { API_ERROR, HTTP_STATUS, VerdaccioError, errorUtils } from '@verdaccio/core';

export function is404Error(err: VerdaccioError): boolean {
  return err.code === HTTP_STATUS.NOT_FOUND;
}

export function create404Error(): VerdaccioError {
  return errorUtils.getNotFound('no such package available');
}

export function is409Error(err: VerdaccioError): boolean {
  return err.code === HTTP_STATUS.CONFLICT;
}

export function create409Error(): VerdaccioError {
  return errorUtils.getConflict('file already exists');
}

export function is503Error(err: VerdaccioError): boolean {
  return err.code === HTTP_STATUS.SERVICE_UNAVAILABLE;
}

export function create503Error(): VerdaccioError {
  return errorUtils.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, 'resource temporarily unavailable');
}

export function convertS3Error(err: AWSError): VerdaccioError {
  switch (err.code) {
    case 'NoSuchKey':
    case 'NotFound':
      return errorUtils.getNotFound();
    case 'StreamContentLengthMismatch':
      return errorUtils.getInternalError(API_ERROR.CONTENT_MISMATCH);
    case 'RequestAbortedError':
      return errorUtils.getInternalError('request aborted');
    default:
      return errorUtils.getCode(err.statusCode!, err.message);
  }
}
