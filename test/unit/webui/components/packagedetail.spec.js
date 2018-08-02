/**
 * PackageDetail component
 */
import React from 'react';
import { shallow } from 'enzyme';
import PackageDetail from '../../../../src/webui/components/PackageDetail/index';
import Readme from '../../../../src/webui/components/Readme/index';
import {WEB_TITLE} from '../../../../src/lib/constants';

console.error = jest.fn();

describe('<PackageDetail /> component', () => {
  it('should give error for required props', () => {
    shallow(<PackageDetail />);
    expect(console.error).toBeCalled();
  });

  it('should load the component', () => {
    const props = {
      readMe: 'Test readme',
      packageName: WEB_TITLE
    };
    const wrapper = shallow(<PackageDetail {...props} />);

    expect(wrapper.find('h1').text()).toEqual(WEB_TITLE);
    expect(
      wrapper
        .find(Readme)
        .dive()
        .html()
    ).toEqual('<div class="markdown-body">Test readme</div>');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
