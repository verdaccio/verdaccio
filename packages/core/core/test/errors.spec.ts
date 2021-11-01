import _ from 'lodash';

import { HTTP_STATUS } from '../src/constants';
import {
  API_ERROR,
  VerdaccioError,
  getBadData,
  getCode,
  getConflict,
  getForbidden,
  getInternalError,
  getNotFound,
  getServiceUnavailable,
  getUnauthorized,
} from '../src/error-utils';

describe('testing errors', () => {
  test('should qualify as an native error', () => {
    expect(_.isError(getNotFound())).toBeTruthy();
    expect(_.isError(getConflict())).toBeTruthy();
    expect(_.isError(getBadData())).toBeTruthy();
    expect(_.isError(getInternalError())).toBeTruthy();
    expect(_.isError(getUnauthorized())).toBeTruthy();
    expect(_.isError(getForbidden())).toBeTruthy();
    expect(_.isError(getServiceUnavailable())).toBeTruthy();
    expect(_.isError(getCode(400, 'fooError'))).toBeTruthy();
  });

  test('should test not found', () => {
    const err: VerdaccioError = getNotFound('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.NOT_FOUND);
    expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
    expect(err.message).toEqual('foo');
  });

  test('should test conflict', () => {
    const err: VerdaccioError = getConflict('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.CONFLICT);
    expect(err.message).toEqual('foo');
  });

  test('should test bad data', () => {
    const err: VerdaccioError = getBadData('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.BAD_DATA);
    expect(err.message).toEqual('foo');
  });

  test('should test internal error custom message', () => {
    const err: VerdaccioError = getInternalError('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.INTERNAL_ERROR);
    expect(err.message).toEqual('foo');
  });

  test('should test internal error', () => {
    const err: VerdaccioError = getInternalError();

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.INTERNAL_ERROR);
    expect(err.message).toEqual(API_ERROR.UNKNOWN_ERROR);
  });

  test('should test Unauthorized message', () => {
    const err: VerdaccioError = getUnauthorized('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.UNAUTHORIZED);
    expect(err.message).toEqual('foo');
  });

  test('should test forbidden message', () => {
    const err: VerdaccioError = getForbidden('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.FORBIDDEN);
    expect(err.message).toEqual('foo');
  });

  test('should test service unavailable message', () => {
    const err: VerdaccioError = getServiceUnavailable('foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(err.message).toEqual('foo');
  });

  test('should test custom code error message', () => {
    const err: VerdaccioError = getCode(HTTP_STATUS.NOT_FOUND, 'foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.NOT_FOUND);
    expect(err.message).toEqual('foo');
  });

  test('should test custom code ok message', () => {
    const err: VerdaccioError = getCode(HTTP_STATUS.OK, 'foo');

    expect(err.code).toBeDefined();
    expect(err.code).toEqual(HTTP_STATUS.OK);
  });
});
