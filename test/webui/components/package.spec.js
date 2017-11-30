/**
 * Package component
 */

import React from 'react';
import { mount } from 'enzyme';
import Package from '../../../src/webui/src/components/Package';
import { BrowserRouter } from 'react-router-dom';

describe('<Package /> component', () => {
  it('should load the component', () => {
    const props = {
      name: 'verdaccio',
      version: '1.0.0',
      description: 'Private NPM repository',
      author: { name: 'Sam' }
    };
    const wrapper = mount(
      <BrowserRouter>
        <Package package={props} />
      </BrowserRouter>
    );

    // renderAuthor method
    const renderAuthor = wrapper.find(Package).instance().renderAuthor;
    expect(renderAuthor({ author: {} })).toBeUndefined();
    expect(renderAuthor({ author: { name: 'sam' } })).toBeDefined();

    // integration expectations
    expect(wrapper.find('a').prop('href')).toEqual('detail/verdaccio');
    expect(wrapper.find('h1').text()).toEqual('verdacciov1.0.0');
    expect(wrapper.find('.el-tag--gray').text()).toEqual('v1.0.0');
    expect(
      wrapper
        .find('span')
        .filterWhere(n => n.prop('role') === 'author')
        .text()
    ).toEqual('By: Sam');
    expect(wrapper.find('p').text()).toEqual('Private NPM repository');
  });
});
