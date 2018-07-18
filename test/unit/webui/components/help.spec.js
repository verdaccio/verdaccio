/**
 * Help component
 */
import React from 'react';
import { shallow } from 'enzyme';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';
import Help from '../../../../src/webui/components/Help/index';

describe('<Help /> component', () => {

  it('should set html from props with / base path', () => {
    jsdom.reconfigure({
      url: "http://example.com/"
    });
    const wrapper = shallow(<Help />);
    expect(
      wrapper
        .find('#adduser')
        .find(SyntaxHighlighter)
        .dive()
        .text()
    ).toEqual('npm adduser --registry  http://example.com');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should set html from props with someOtherPath', () => {
    jsdom.reconfigure({
      url: "http://example.com/someOtherPath"
    });
    const wrapper = shallow(<Help />);
    expect(
      wrapper
        .find('#publish')
        .find(SyntaxHighlighter)
        .dive()
        .text()
    ).toEqual('npm publish --registry http://example.com/someOtherPath');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
