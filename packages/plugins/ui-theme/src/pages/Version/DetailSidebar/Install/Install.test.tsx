import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext } from '../../context';
import { DetailContextProps } from '../../version-config';

import data from './__partials__/data.json';
import Install from './Install';

const detailContextValue: Partial<DetailContextProps> = {
  packageName: 'foo',
  packageMeta: data,
};

const ComponentToBeRendered: React.FC = () => (
  <DetailContext.Provider value={detailContextValue}>
    <Install />
  </DetailContext.Provider>
);

/* eslint-disable react/jsx-no-bind*/
describe('<Install />', () => {
  test('renders correctly', () => {
    const { container } = render(<ComponentToBeRendered />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should have 3 children', () => {
    const { getByTestId } = render(<ComponentToBeRendered />);
    const installListItems = getByTestId('installList');
    // installitems + subHeader = 4
    expect(installListItems.children.length).toBe(4);
  });

  test('should have the element NPM', () => {
    const { getByTestId, queryByText } = render(<ComponentToBeRendered />);
    expect(getByTestId('installListItem-npm')).toBeTruthy();
    expect(queryByText(`npm install ${detailContextValue.packageName}`)).toBeTruthy();
    expect(queryByText('Install using npm')).toBeTruthy();
  });

  test('should have the element YARN', () => {
    const { getByTestId, queryByText } = render(<ComponentToBeRendered />);
    expect(getByTestId('installListItem-yarn')).toBeTruthy();
    expect(queryByText(`yarn add ${detailContextValue.packageName}`)).toBeTruthy();
    expect(queryByText('Install using yarn')).toBeTruthy();
  });

  test('should have the element PNPM', () => {
    const { getByTestId, queryByText } = render(<ComponentToBeRendered />);
    expect(getByTestId('installListItem-pnpm')).toBeTruthy();
    expect(queryByText(`pnpm install ${detailContextValue.packageName}`)).toBeTruthy();
    expect(queryByText('Install using pnpm')).toBeTruthy();
  });
});
