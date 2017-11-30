/**
 * Help component
 */

import React from 'react';
import { shallow } from 'enzyme';
import Help from '../../../src/webui/src/components/Help';

describe('<NoItem /> component', () => {
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
    expect(wrapper.html()).toEqual(
      '<div><li><h1>No Package Published Yet</h1><div><div>To publish your first package just:</div><br/><strong>1. Login</strong><pre style="display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8"><code>npm adduser --registry  http:<span style="color:#aeaeae;font-style:italic">//example.com</span></code></pre><strong>2. Publish</strong><pre style="display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8"><code>npm publish --registry http:<span style="color:#aeaeae;font-style:italic">//example.com</span></code></pre><strong>3. Refresh this page!</strong></div></li></div>'
    );
  });

  it('should set html from props with someOtherPath', () => {
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/someOtherPath'
    });
    const wrapper = shallow(<Help />);
    expect(wrapper.html()).toEqual('<div><li><h1>No Package Published Yet</h1><div><div>To publish your first package just:</div><br/><strong>1. Login</strong><pre style="display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8"><code>npm adduser --registry  http:<span style="color:#aeaeae;font-style:italic">//example.com/someOtherPath</span></code></pre><strong>2. Publish</strong><pre style="display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8"><code>npm publish --registry http:<span style="color:#aeaeae;font-style:italic">//example.com/someOtherPath</span></code></pre><strong>3. Refresh this page!</strong></div></li></div>');
  });
});
