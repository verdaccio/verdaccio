import { stringUtils } from '../src';

describe('string-utils', () => {
  test('getByQualityPriorityValue', () => {
    expect(stringUtils.getByQualityPriorityValue('')).toEqual('');
    expect(stringUtils.getByQualityPriorityValue(null)).toEqual('');
    expect(stringUtils.getByQualityPriorityValue(undefined)).toEqual('');
    expect(stringUtils.getByQualityPriorityValue('something')).toEqual('something');
    expect(stringUtils.getByQualityPriorityValue('something,')).toEqual('something');
    expect(stringUtils.getByQualityPriorityValue('0,')).toEqual('0');
    expect(stringUtils.getByQualityPriorityValue('application/json')).toEqual('application/json');
    expect(stringUtils.getByQualityPriorityValue('application/json; q=1')).toEqual(
      'application/json'
    );
    expect(stringUtils.getByQualityPriorityValue('application/json; q=')).toEqual(
      'application/json'
    );
    expect(stringUtils.getByQualityPriorityValue('application/json;')).toEqual('application/json');
    expect(
      stringUtils.getByQualityPriorityValue(
        'application/json; q=1.0, application/vnd.npm.install-v1+json; q=0.9, */*'
      )
    ).toEqual('application/json');
    expect(
      stringUtils.getByQualityPriorityValue(
        'application/json; q=1.0, application/vnd.npm.install-v1+json; q=, */*'
      )
    ).toEqual('application/json');
    expect(
      stringUtils.getByQualityPriorityValue(
        'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.9, */*'
      )
    ).toEqual('application/vnd.npm.install-v1+json');
    expect(
      stringUtils.getByQualityPriorityValue(
        'application/vnd.npm.install-v1+json; q=, application/json; q=0.9, */*'
      )
    ).toEqual('application/json');
  });
});
