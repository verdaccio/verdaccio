/**
 * Help component
 */

import React from 'react';
import { shallow } from 'enzyme';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';
import Help from '../../../src/webui/src/components/Help';

describe('<Help /> component', () => {
  beforeEach(() => {
    /**
     * @see https://github.com/facebook/jest/issues/890
     */
    Object.defineProperty(window.location, 'origin', {
      writable: true,
      value: 'http://example.com'
    });
  });
  it('should set html from props with / base path', () => {
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/'
    });
    const wrapper = shallow(<Help />);
    expect(
      wrapper
        .find('#adduser')
        .find(SyntaxHighlighter)
        .dive()
        .text()
    ).toEqual('npm adduser --registry  http://example.com');
  });

  it('should set html from props with someOtherPath', () => {
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/someOtherPath'
    });
    const wrapper = shallow(<Help />);
    expect(
      wrapper
        .find('#publish')
        .find(SyntaxHighlighter)
        .dive()
        .text()
    ).toEqual('npm publish --registry http://example.com/someOtherPath');
  });
});
