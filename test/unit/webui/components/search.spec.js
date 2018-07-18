/**
 * Search component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Search from '../../../../src/webui/components/Search/index';
console.error = jest.fn();

describe('<Search /> component', () => {
  it('should give error for the required fields', () => {
    const wrapper = shallow(<Search />);
    expect(console.error).toBeCalled();
    expect(wrapper.find('input').prop('placeholder')).toEqual(
      'Type to search...'
    );
  });

  it('should have <input /> element with correct properties', () => {
    const props = {
      handleSearchInput: () => {},
      placeHolder: 'Test placeholder'
    };
    const wrapper = shallow(<Search {...props} />);
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('input').prop('placeholder')).toEqual(
      'Test placeholder'
    );
  });

  it('should call the handleSearchInput function', () => {
    const props = {
      handleSearchInput: jest.fn()
    };
    const wrapper = shallow(<Search {...props} />);
    wrapper.find('input').simulate('change');
    expect(props.handleSearchInput).toBeCalled();
  });

  it('should match the snapshot', () => {
    const props = { handleSearchInput: () => {} };
    const wrapper = shallow(<Search {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
