/**
 * PackageList component
 */

import React from 'react';
import { mount } from 'enzyme';
import PackageList from '../../../src/webui/src/components/PackageList';
import Help from '../../../src/webui/src/components/Help';
import NoItems from '../../../src/webui/src/components/NoItems';
import { BrowserRouter } from 'react-router-dom';

describe('<PackageList /> component', () => {
  it('should load the component with no packages', () => {
    const props = {
      packages: [],
      help: true
    };
    const wrapper = mount(
      <PackageList packages={props.packages} help={props.help} />
    );

    const instance = wrapper.instance();
    expect(instance.isTherePackages()).toBeFalsy();
    expect(instance.renderHelp()).toBeTruthy();
    expect(instance.renderOptions()).toEqual(<Help />);
    expect(instance.renderTitle()).toBeUndefined();
  });

  it('should load the component with packages', () => {
    const props = {
      packages: [
        {
          name: 'verdaccio',
          version: '1.0.0',
          description: 'Private NPM repository',
          author: { name: 'Sam' }
        },
        {
          name: 'abc',
          version: '1.0.1',
          description: 'abc description',
          author: { name: 'Rose' }
        },
        {
          name: 'xyz',
          version: '1.1.0',
          description: 'xyz description',
          author: { name: 'Martin' }
        }
      ],
      help: false
    };
    const wrapper = mount(
      <BrowserRouter>
        <PackageList packages={props.packages} help={props.help} />
      </BrowserRouter>
    );

    const instance = wrapper.find(PackageList).instance();

    expect(instance.isTherePackages()).toBeTruthy();
    expect(instance.renderHelp()).toBeUndefined();
    expect(instance.renderTitle().props.children).toEqual('Available Packages');
    expect(instance.renderNoItems()).toEqual(
      <NoItems text="No items were found with that query" />
    );
    expect(instance.renderOptions()).toEqual(
      <NoItems text="No items were found with that query" />
    );
    // package count
    expect(wrapper.find('Package')).toHaveLength(3);
    // match snapshot
    expect(wrapper.html()).toMatchSnapshot();
  });
});
