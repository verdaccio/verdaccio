/**
 * Readme component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Readme from '../../../../src/webui/components/Readme/index';

console.error = jest.fn();

describe('<Readme /> component', () => {
  it('should give error for the required fields', () => {
    shallow(<Readme />);
    expect(console.error).toBeCalled();
  });

  it('should dangerously set html', () => {
    const props = {
      readMe: '<h1>This is a test string</h1>'
    };
    const wrapper = shallow(<Readme {...props} />);
    expect(wrapper.html()).toEqual(
      '<div class="markdown-body"><h1>This is a test string</h1></div>'
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
