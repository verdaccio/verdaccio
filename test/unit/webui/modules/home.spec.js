/**
 * Home Component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Home from '../../../../src/webui/modules/home/index';
// import Search from '../../../../src/webui/components/Search/index';
import { Loading } from 'element-react';
console.error = jest.fn();

describe('<Home /> Component', () => {

  it('should render loader', () => {
    const props = {
      text:"Test Loader Text"
    };
    const wrapper = shallow(<Loading {...props} />);
    expect(wrapper.find('p').text()).toEqual(
      'Test Loader Text'
    );
  });

  it('should trim the search value', () => {
    const wrapper = shallow(<Home />);

    wrapper.instance().handleSearchInput({
      target: {
        value: 'test query string one'
      }
    });
    expect(wrapper.state('query')).toBe('test query string one'); // on value '   '

    wrapper.instance().handleSearchInput({
      target: {
        value: "   "
      }
    });
    expect(wrapper.state('query')).toBe('');

    wrapper.instance().handleSearchInput({
      target: {
        value: " test query string two  "
      }
    });
    expect(wrapper.state('query')).toBe('test query string two');
  });

  it('should make API call to load packages', () => {

  });

});