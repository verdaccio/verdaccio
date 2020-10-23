import { AWSError } from 'aws-sdk';
import {
  getNotFound,
  getCode,
  getInternalError,
  getConflict,
  API_ERROR,
  HTTP_STATUS,
  VerdaccioError,
} from '@verdaccio/commons-api';

export function is404Error(err: VerdaccioError): boolean {
  return err.code === HTTP_STATUS.NOT_FOUND;
}

export function create404Error(): VerdaccioError {
  return getNotFound('no such package available');
}

export function is409Error(err: VerdaccioError): boolean {
  return err.code === HTTP_STATUS.CONFLICT;
}

export function create409Error(): VerdaccioError {
  return getConflict('file already exists');
}

export function is503Error(err: VerdaccioError): boolean {
  return err.code === HTTP_STATUS.SERVICE_UNAVAILABLE;
}

export function create503Error(): VerdaccioError {
  return getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, 'resource temporarily unavailable');
}

export function convertS3Error(err: AWSError): VerdaccioError {
  switch (err.code) {
    case 'NoSuchKey':
    case 'NotFound':
      return getNotFound();
    case 'StreamContentLengthMismatch':
      return getInternalError(API_ERROR.CONTENT_MISMATCH);
    case 'RequestAbortedError':
      return getInternalError('request aborted');
    default:
      return getCode(err.statusCode, err.message);
  }
}
