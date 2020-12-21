import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext } from '../../context';
import { DetailContextProps } from '../../version-config';

import data from './__partials__/data.json';
import Repository from './Repository';

const detailContextValue: DetailContextProps = {
  packageName: 'foo',
  readMe: 'readMe',
  enableLoading: () => {},
  isLoading: false,
  hasNotBeenFound: false,
  packageMeta: data,
};

const ComponentToBeRendered: React.FC<{ contextValue: DetailContextProps }> = ({
  contextValue,
}) => (
  <DetailContext.Provider value={contextValue}>
    <Repository />
  </DetailContext.Provider>
);

describe('<Repository /> component', () => {
  test('should load the component in default state', () => {
    const { container } = render(<ComponentToBeRendered contextValue={detailContextValue} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render the component in with no repository data', () => {
    const packageMeta = {
      ...detailContextValue.packageMeta,
      latest: {
        ...detailContextValue.packageMeta?.latest,
        repository: undefined,
      },
    };

    const { queryByText } = render(
      <ComponentToBeRendered
        contextValue={{
          ...detailContextValue,
          packageMeta,
        }}
      />
    );

    expect(queryByText('Repository')).toBeFalsy();
  });

  test('should render the component in with invalid url', () => {
    const packageMeta = {
      ...detailContextValue.packageMeta,
      latest: {
        ...detailContextValue.packageMeta?.latest,
        repository: {
          type: 'git',
          url: 'git://github.com/verdaccio/ui.git',
        },
      },
    };

    const { queryByText } = render(
      <ComponentToBeRendered
        contextValue={{
          ...detailContextValue,
          packageMeta,
        }}
      />
    );

    expect(queryByText('Repository')).toBeFalsy();
  });
});
