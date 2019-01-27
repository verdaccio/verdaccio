/**
 * NotFound component
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import NotFound from '../../../../src/webui/components/NotFound/index';

console.error = jest.fn();

describe('<NotFound /> component', () => {
  let routerWrapper;
  beforeEach(() => {
    routerWrapper = shallow(
      <Router>
        <NotFound />
      </Router>
    );
  });


  test('should load the component in default state', () => {
    expect(routerWrapper.html()).toMatchSnapshot();
  });

});
