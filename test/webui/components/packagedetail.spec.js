/**
 * PackageDetail component
 */
import React from 'react';
import { shallow } from 'enzyme';
import PackageDetail from '../../../src/webui/src/components/PackageDetail';
import Readme from '../../../src/webui/src/components/Readme';

console.error = jest.fn();

describe('<PackageDetail /> component', () => {
  it('should give error for required props', () => {
    shallow(<PackageDetail />);
    expect(console.error).toBeCalled();
  });

  it('should load the component', () => {
    const props = {
      readMe: 'Test readme',
      package: 'Verdaccio'
    };
    const wrapper = shallow(<PackageDetail {...props} />);

    expect(wrapper.find('h1').text()).toEqual('Verdaccio');
    expect(
      wrapper
        .find(Readme)
        .dive()
        .html()
    ).toEqual('<div class="markdown-body">Test readme</div>');
  });
});
