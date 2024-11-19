import { describe, expect, test } from 'vitest';

import { composeTarballFromPackage } from '../src';
import { getLocalRegistryTarballUri } from '../src/getLocalRegistryTarballUri';

describe('getLocalRegistryTarballUri', () => {
  test('should return the right tarball uri', () => {
    const uri = 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz';
    const pkgName = 'npm_test';
    const requestOptions = {
      host: 'localhost:4873',
      protocol: 'http',
      headers: {
        host: 'localhost:4873',
      },
    };
    const urlPrefix = '/';
    expect(getLocalRegistryTarballUri(uri, pkgName, requestOptions, urlPrefix)).toEqual(
      'http://localhost:4873/npm_test/-/npm_test-1.0.0.tgz'
    );
  });

  test('should return the right tarball uri with prefix', () => {
    const uri = 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz';
    const pkgName = 'npm_test';
    const requestOptions = {
      host: 'localhost:4873',
      protocol: 'http',
      headers: {
        host: 'localhost:4873',
      },
    };
    const urlPrefix = '/local/';
    expect(getLocalRegistryTarballUri(uri, pkgName, requestOptions, urlPrefix)).toEqual(
      'http://localhost:4873/local/npm_test/-/npm_test-1.0.0.tgz'
    );
  });

  test('should return the right tarball uri without prefix', () => {
    const uri = 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz';
    const pkgName = 'npm_test';
    const requestOptions = {
      host: 'localhost:4873',
      protocol: 'http',
      headers: {
        host: 'localhost:4873',
      },
    };
    expect(getLocalRegistryTarballUri(uri, pkgName, requestOptions, undefined)).toEqual(
      'http://localhost:4873/npm_test/-/npm_test-1.0.0.tgz'
    );
  });

  test('should return filename of tarball', () => {
    expect(composeTarballFromPackage('npm_test', '1.0.0')).toEqual('npm_test-1.0.0.tgz');
    expect(composeTarballFromPackage('@mbtools/npm_test', '1.0.1')).toEqual('npm_test-1.0.1.tgz');
  });
});
