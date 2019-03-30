/**
 * Readme component
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Readme from '../../../../src/webui/components/Readme/index';

describe('<Readme /> component', () => {
  test('should load the component in default state', () => {
    const wrapper = mount(<Readme description={"test"} />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should dangerously set html', () => {
    const wrapper = shallow(<Readme description={"<h1>This is a test string</h1>"} />);
    expect(wrapper.html()).toEqual(
      '<div class="markdown-body"><h1>This is a test string</h1></div>'
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
