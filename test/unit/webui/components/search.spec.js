/**
 * @flow
 * @prettier
 */

import React from 'react';
import { mount } from 'enzyme';

import Search from '../../../../src/webui/components/Search/index';

const SEARCH_FILE_PATH = '../../../../src/webui/components/Search/index';

// Global mocks
const event = {
  stopPropagation: jest.fn(),
};

window.location.assign = jest.fn();

describe('<Search /> component test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Search />);
  });

  test('should load the component in default state', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('onBlur: should cancel all search requests', async () => {
    const { onBlur, requestList } = wrapper.instance();
    const spy = jest.spyOn(wrapper.instance(), 'cancelAllSearchRequests');
    // add one request
    const request = {
      abort: jest.fn(),
    };
    wrapper.instance().requestList = [request];

    onBlur(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(wrapper.state('error')).toBeFalsy();
    expect(wrapper.state('loaded')).toBeFalsy();
    expect(wrapper.state('loading')).toBeFalsy();
    expect(spy).toHaveBeenCalled();
    expect(requestList).toEqual([]);
  });

  test('handleSearch: should set value in state when value is defined', () => {
    const { handleSearch } = wrapper.instance();
    const newValue = 'verdaccio';

    handleSearch(event, { newValue, method: 'type' });

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(wrapper.state('error')).toBeFalsy();
    expect(wrapper.state('loaded')).toBeFalsy();
    expect(wrapper.state('loading')).toBeTruthy();
    expect(wrapper.state('search')).toEqual(newValue);
  });

  test('handleSearch: cancel all search requests when there is no value in search component with type method', () => {
    const { handleSearch, requestList } = wrapper.instance();
    const spy = jest.spyOn(wrapper.instance(), 'cancelAllSearchRequests');
    const newValue = '';

    handleSearch(event, { newValue, method: 'type' });

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(wrapper.state('error')).toBeFalsy();
    expect(wrapper.state('loaded')).toBeFalsy();
    expect(wrapper.state('loading')).toBeTruthy();
    expect(wrapper.state('search')).toEqual(newValue);
    expect(spy).toHaveBeenCalled();
    expect(requestList).toEqual([]);
  });

  test('handleSearch: when method is not type method', () => {
    const { handleSearch } = wrapper.instance();
    const newValue = '';

    handleSearch(event, { newValue, method: 'click' });

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(wrapper.state('error')).toBeFalsy();
    expect(wrapper.state('loaded')).toBeFalsy();
    expect(wrapper.state('loading')).toBeFalsy();
    expect(wrapper.state('search')).toEqual(newValue);
  });

  test('handlePackagesClearRequested: should clear suggestions', () => {
    const { handlePackagesClearRequested } = wrapper.instance();

    handlePackagesClearRequested();

    expect(wrapper.state('suggestions')).toEqual([]);
  });

  test('handleFetchPackages: should load the packages from API', async () => {
    const apiResponse = [{ name: 'verdaccio' }, { name: 'verdaccio-htpasswd' }];
    const suggestions = [{ label: 'verdaccio' }, { label: 'verdaccio-htpasswd' }];

    jest.resetModules();
    jest.doMock('../../../../src/webui/utils/api', () => ({
      request(url) {
        expect(url).toEqual('search/verdaccio');
        return Promise.resolve(apiResponse);
      },
    }));
    jest.doMock('lodash/debounce', () => {
      return function debounceMock(fn, delay) {
        return fn;
      };
    });

    const Search = require(SEARCH_FILE_PATH).default;
    const component = mount(<Search />);
    component.setState({ search: 'verdaccio' });
    const { handleFetchPackages } = component.instance();
    await handleFetchPackages({ value: 'verdaccio' });
    expect(component.state('suggestions')).toEqual(suggestions);
    expect(component.state('error')).toBeFalsy();
    expect(component.state('loaded')).toBeTruthy();
    expect(component.state('loading')).toBeFalsy();
  });

  test('handleFetchPackages: when browser cancel a request', async () => {
    const apiResponse = {
      name: 'AbortError',
    };

    jest.resetModules();
    jest.doMock('../../../../src/webui/utils/api', () => ({
      request: jest.fn(() => Promise.reject(apiResponse)),
    }));
    jest.doMock('lodash/debounce', () => {
      return function debounceMock(fn, delay) {
        return fn;
      };
    });

    const Search = require(SEARCH_FILE_PATH).default;
    const component = mount(<Search />);
    component.setState({ search: 'verdaccio' });
    const { handleFetchPackages } = component.instance();
    await handleFetchPackages({ value: 'verdaccio' });
    expect(component.state('error')).toBeFalsy();
    expect(component.state('loaded')).toBeFalsy();
    expect(component.state('loading')).toBeFalsy();
  });

  test('handleFetchPackages: when API server failed request', async () => {
    const apiResponse = {
      name: 'BAD_REQUEST',
    };

    jest.resetModules();
    jest.doMock('../../../../src/webui/utils/api', () => ({
      request(url) {
        expect(url).toEqual('search/verdaccio');
        return Promise.reject(apiResponse);
      },
    }));
    jest.doMock('lodash/debounce', () => {
      return function debounceMock(fn, delay) {
        return fn;
      };
    });

    const Search = require(SEARCH_FILE_PATH).default;
    const component = mount(<Search />);
    component.setState({ search: 'verdaccio' });
    const { handleFetchPackages } = component.instance();
    await handleFetchPackages({ value: 'verdaccio' });
    expect(component.state('error')).toBeTruthy();
    expect(component.state('loaded')).toBeFalsy();
    expect(component.state('loading')).toBeFalsy();
  });

  test('handleClickSearch: should change the window location on click or return key', () => {
    jest.resetModules();
    const getDetailPageURL = jest.fn(() => 'detail/page/url');
    jest.doMock('../../../../src/webui/utils/url', () => ({
      getDetailPageURL,
    }));

    const suggestionValue = [];
    const Search = require(SEARCH_FILE_PATH).default;
    const component = mount(<Search />);
    const { handleClickSearch } = component.instance();

    // click
    handleClickSearch(event, { suggestionValue, method: 'click' });
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(getDetailPageURL).toHaveBeenCalledWith(suggestionValue);
    expect(window.location.assign).toHaveBeenCalledWith('detail/page/url');

    // return key
    handleClickSearch(event, { suggestionValue, method: 'enter' });
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(getDetailPageURL).toHaveBeenCalledWith(suggestionValue);
    expect(window.location.assign).toHaveBeenCalledWith('detail/page/url');
  });
});
