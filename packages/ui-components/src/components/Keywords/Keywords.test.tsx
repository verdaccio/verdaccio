import React from 'react';

import { cleanup, render } from '../../test/test-react-testing-library';
import { PackageMetaInterface } from '../../types/packageMeta';
import Keywords from './Keywords';

const withKeywordsComponent = (packageMeta: PackageMetaInterface): JSX.Element => (
  <Keywords packageMeta={packageMeta} />
);

describe('<Keywords /> component', () => {
  afterEach(function () {
    cleanup();
  });

  test('should render the component in default state', () => {
    const { getByText } = render(
      withKeywordsComponent({
        latest: {
          name: 'verdaccio1',
          version: '4.0.0',
          keywords: ['verdaccio', 'npm', 'yarn'],
        },
      })
    );
    expect(getByText('sidebar.keywords.title')).toBeInTheDocument();
    expect(getByText('verdaccio')).toBeInTheDocument();
    expect(getByText('npm')).toBeInTheDocument();
    expect(getByText('yarn')).toBeInTheDocument();
  });
});
