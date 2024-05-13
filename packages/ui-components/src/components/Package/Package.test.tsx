import React from 'react';
import { MemoryRouter } from 'react-router';

import { store } from '../../';
import { cleanup, renderWithStore } from '../../test/test-react-testing-library';
import Package from './Package';

/**
 * Generates one month back date from current time
 * @return {object} date object
 */
const dateOneMonthAgo = (): Date => new Date(1544377770747);

describe('<Package /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should load the component', () => {
    const props = {
      name: 'verdaccio',
      version: '1.0.0',
      time: String(dateOneMonthAgo()),
      license: 'MIT',
      description: 'Private NPM repository',
      author: {
        name: 'Sam',
      },
      keywords: ['verdaccio-core'],
    };

    const wrapper = renderWithStore(
      <MemoryRouter>
        <Package
          author={props.author}
          description={props.description}
          keywords={props.keywords}
          license={props.license}
          name={props.name}
          time={props.time}
          version={props.version}
        />
      </MemoryRouter>,
      store
    );

    // FUTURE: improve this expectectations
    expect(wrapper.getByText('verdaccio')).toBeInTheDocument();
    expect(wrapper.getByText('Private NPM repository')).toBeInTheDocument();
    expect(wrapper.getByText('package.version')).toBeInTheDocument();
    expect(wrapper.getByText('MIT')).toBeInTheDocument();
  });

  test.todo('should load the component without author');
});
