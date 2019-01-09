/**
 * ModuleContentPlaceholder component
 */

import React from 'react';
import { shallow } from 'enzyme';
import ModuleContentPlaceholder from '../../../../../src/webui/components/PackageSidebar/ModuleContentPlaceholder/index';

console.error = jest.fn();

describe('<PackageSidebar /> : <ModuleContentPlaceholder />', () => {
  test('should error for required props', () => {
    shallow(<ModuleContentPlaceholder />);
    expect(console.error).toHaveBeenCalled();
  });
  test('should load module component', () => {
    const props = {
      text: 'Test text'
    };
    const wrapper = shallow(<ModuleContentPlaceholder {...props} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
