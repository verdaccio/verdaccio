/**
 * Home Component
 */

import React from 'react';
import { mount } from 'enzyme';
import Home from '../../../../src/webui/modules/home/index';

describe('<Home /> Component', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(<Home />);
  });

  it('handleSearchInput - should match the search query', () => {
    const { handleSearchInput } = wrapper.instance();
    const result = 'test query string one';
    const input = {
      target: {
        value: result
      }
    };
    handleSearchInput(input);
    expect(wrapper.state('query')).toBe(result);
  });

  it('handleSearchInput - should match the trimmed search query', () => {
    const { handleSearchInput } = wrapper.instance();
    const result = '  ';
    const input = {
      target: {
        value: result
      }
    };
    handleSearchInput(input);
    expect(wrapper.state('query')).toBe(result.trim());
  });
});
