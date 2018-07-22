/**
 * Package component
 */

import React from 'react';
import { mount } from 'enzyme';
import Package from '../../../../src/webui/components/Package/index';
import { BrowserRouter } from 'react-router-dom';

/**
 * Generates one month back date from current time
 * @return {object} date object
 */
const dateOneMonthAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
}

describe('<Package /> component', () => {
  it('should load the component', () => {
    const props = {
      name: 'verdaccio',
      version: '1.0.0',
      time: dateOneMonthAgo(),
      license: 'MIT',
      description: 'Private NPM repository',
      author: 'Sam'
    };
    const wrapper = mount(
      <BrowserRouter>
        <Package {...props}/>
      </BrowserRouter>
    );

    // integration expectations
    expect(wrapper.find('a').prop('href')).toEqual('detail/verdaccio');
    expect(wrapper.find('h1').text()).toEqual('verdaccio v1.0.0');
    expect(wrapper.find('.el-tag--gray').text()).toEqual('v1.0.0');
    expect(
      wrapper.find('div').filterWhere(n => n.prop('role') === 'author')
        .text()
    ).toEqual('By: Sam');
    expect(wrapper.find('p').text()).toEqual('Private NPM repository');
    expect(wrapper.find('.license').text()).toMatch(/MIT/);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should load the component without author', () => {
    const props = {
      name: 'verdaccio',
      version: '1.0.0',
      time: dateOneMonthAgo(),
      license: 'MIT',
      description: 'Private NPM repository'
    };
    const wrapper = mount(
      <BrowserRouter>
        <Package {...props} />
      </BrowserRouter>
    );

    // integration expectations
    expect(
      wrapper.find('div').filterWhere(n => n.prop('role') === 'author')
        .text()
    ).toEqual('');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
 