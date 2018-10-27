/**
 * Help component
 */
import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';
import Help from '../../../../src/webui/components/Help/index';

describe('<Help /> component', () => {

  it('should set html from props with / base path', () => {
    jsdom.reconfigure({
      url: "http://example.com/"
    });
    const wrapper = mount(
      <IntlProvider locale='en'>
          <Help />
      </IntlProvider>,
    );
    expect(
      wrapper
        .find('#adduser')
        .find(SyntaxHighlighter)
        .text()
    ).toEqual('npm adduser --registry http://example.com');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should set html from props with someOtherPath', () => {
    jsdom.reconfigure({
      url: "http://example.com/someOtherPath"
    });

    const wrapper = mount(
      <IntlProvider locale='en'>
          <Help />
      </IntlProvider>,
    );

    expect(
      wrapper
        .find('#publish')
        .find(SyntaxHighlighter)
        .text()
    ).toEqual('npm publish --registry http://example.com/someOtherPath');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
