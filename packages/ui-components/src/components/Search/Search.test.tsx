import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { api, store } from '../../';
import { fireEvent, renderWithStore, screen, waitFor } from '../../test/test-react-testing-library';
import Search from './Search';
import { cleanDescription } from './utils';

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => {
    fn.cancel = jest.fn();
    return fn;
  })
);

/* eslint-disable verdaccio/jsx-spread */
const ComponentToBeRendered: React.FC = () => (
  <Router>
    <Search />
  </Router>
);

describe('<Search /> component', () => {
  beforeEach(() => {
    jest.spyOn(api, 'request').mockImplementation(() =>
      Promise.resolve([
        {
          name: 'verdaccio-ui/types',
          version: '8.4.2',
        },
        {
          name: 'verdaccio',
          version: '4.3.5',
        },
      ])
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load the component in default state', () => {
    renderWithStore(<ComponentToBeRendered />, store);
    expect(screen.getByPlaceholderText('search.packages')).toBeInTheDocument();
  });

  test('handleSearch: when user type package name in search component, show suggestions', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithStore(
      <ComponentToBeRendered />,
      store
    );

    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });

    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));

    expect(suggestionsElements).toHaveLength(1);
    expect(api.request).toHaveBeenCalledTimes(1);
  });

  test('onBlur: should cancel all search requests', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithStore(
      <ComponentToBeRendered />,
      store
    );

    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(1);
    expect(api.request).toHaveBeenCalledTimes(1);

    fireEvent.blur(autoCompleteInput);
    const listBoxElement = screen.queryAllByRole('listbox');
    expect(listBoxElement).toHaveLength(0);
  });

  test('handleSearch: cancel all search requests when there is no value in search component with type method', async () => {
    const { getByPlaceholderText } = renderWithStore(<ComponentToBeRendered />, store);

    const autoCompleteInput = getByPlaceholderText('search.packages');
    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: ' ', method: 'type' } });
    expect(autoCompleteInput).toHaveAttribute('value', ' ');
    const listBoxElement = screen.queryAllByRole('listbox');
    expect(listBoxElement).toHaveLength(0);
    expect(api.request).toHaveBeenCalledTimes(0);
  });

  test('handleSearch: when method is not type method', async () => {
    const { getByPlaceholderText } = renderWithStore(<ComponentToBeRendered />, store);

    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: ' ', method: 'click' } });
    expect(autoCompleteInput).toHaveAttribute('value', ' ');
    const listBoxElement = screen.queryAllByRole('listbox');
    expect(listBoxElement).toHaveLength(0);
    expect(api.request).toHaveBeenCalledTimes(0);
  });

  test('handlePackagesClearRequested: should clear suggestions', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithStore(
      <ComponentToBeRendered />,
      store
    );
    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(1);

    fireEvent.change(autoCompleteInput, { target: { value: ' ' } });
    const listBoxElement = screen.queryAllByRole('listbox');
    // // when the page redirects, the list box should be empty again
    expect(listBoxElement).toHaveLength(0);
    expect(api.request).toHaveBeenCalledTimes(1);
  });

  test('handleClickSearch: should change the window location on click or return key', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithStore(
      <ComponentToBeRendered />,
      store
    );
    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));
    // console.log('suggestionsElements', suggestionsElements);
    expect(suggestionsElements).toHaveLength(1);
    // click on the second suggestion
    fireEvent.click(suggestionsElements[0]);
    const listBoxElement = screen.queryAllByRole('listbox');
    // // when the page redirects, the list box should be empty again
    expect(listBoxElement).toHaveLength(0);
  });
});

describe('cleanDescription', () => {
  test('should return plain text', () => {
    const description = 'Hello, Mars!';
    const output = cleanDescription(description);
    expect(output).toBe(description);
  });

  test('should remove html tags from description', () => {
    const description = '<h1>verdaccio</h1>';
    const output = cleanDescription(description);
    expect(output).toBe('verdaccio');
  });

  test('should remove markdown links from description', () => {
    const description = '[verdaccio](https://verdaccio.org)';
    const output = cleanDescription(description);
    expect(output).toBe('verdaccio');
  });
});
