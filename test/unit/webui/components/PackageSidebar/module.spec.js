/**
 * Module component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Module from '../../../../../src/webui/components/PackageSidebar/Module/index';

console.error = jest.fn();

describe('<PackageSidebar /> : <Module />', () => {
  test('should error for required props', () => {
    shallow(<Module />);
    expect(console.error).toBeCalled();
  });
  test('should load module component', () => {
    const props = {
      title: 'Test title',
      description: 'Test description',
      className: 'module-component'
    };
    const wrapper = shallow(
      <Module {...props}>
        <p>test children</p>
      </Module>
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
