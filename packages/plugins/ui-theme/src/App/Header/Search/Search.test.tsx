import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';
import api from 'verdaccio-ui/utils/api';
import { render, fireEvent, waitFor } from 'verdaccio-ui/utils/test-react-testing-library';

import Search from './Search';

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
    const { container } = render(<ComponentToBeRendered />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('handleSearch: when user type package name in search component, show suggestions', async () => {
    const { getByPlaceholderText, getAllByText } = render(<ComponentToBeRendered />);

    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });

    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => getAllByText('verdaccio', { exact: true }));

    expect(suggestionsElements).toHaveLength(2);
    expect(api.request).toHaveBeenCalledTimes(1);
  });

  test('onBlur: should cancel all search requests', async () => {
    const { getByPlaceholderText, getByRole, getAllByText } = render(<ComponentToBeRendered />);

    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => getAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(2);
    expect(api.request).toHaveBeenCalledTimes(1);

    fireEvent.blur(autoCompleteInput);
    const listBoxElement = await waitFor(() => getByRole('listbox'));
    expect(listBoxElement).toBeEmptyDOMElement();
  });

  test('handleSearch: cancel all search requests when there is no value in search component with type method', async () => {
    const { getByPlaceholderText, getByRole } = render(<ComponentToBeRendered />);

    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: ' ', method: 'type' } });
    expect(autoCompleteInput).toHaveAttribute('value', '');
    const listBoxElement = await waitFor(() => getByRole('listbox'));
    expect(listBoxElement).toBeEmptyDOMElement();
    expect(api.request).toHaveBeenCalledTimes(0);
  });

  test('handleSearch: when method is not type method', async () => {
    const { getByPlaceholderText, getByRole } = render(<ComponentToBeRendered />);

    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: ' ', method: 'click' } });
    expect(autoCompleteInput).toHaveAttribute('value', '');
    const listBoxElement = await waitFor(() => getByRole('listbox'));
    expect(listBoxElement).toBeEmptyDOMElement();
    expect(api.request).toHaveBeenCalledTimes(0);
  });

  test('handleSearch: loading is been displayed', async () => {
    const { getByPlaceholderText, getByText } = render(<ComponentToBeRendered />);
    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const loadingElement = await waitFor(() => getByText('Loading...'));
    expect(loadingElement).toBeTruthy();
  });

  test('handlePackagesClearRequested: should clear suggestions', async () => {
    const { getByPlaceholderText, getAllByText, getByRole } = render(<ComponentToBeRendered />);
    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => getAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(2);

    fireEvent.change(autoCompleteInput, { target: { value: ' ' } });
    const listBoxElement = await waitFor(() => getByRole('listbox'));
    expect(listBoxElement).toBeEmptyDOMElement();

    expect(api.request).toHaveBeenCalledTimes(1);
  });

  test('handleClickSearch: should change the window location on click or return key', async () => {
    const { getByPlaceholderText, getAllByText, getByRole } = render(<ComponentToBeRendered />);
    const autoCompleteInput = getByPlaceholderText('Search Packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => getAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(2);

    // click on the second suggestion
    fireEvent.click(suggestionsElements[1]);
    const listBoxElement = await waitFor(() => getByRole('listbox'));
    // when the page redirects, the list box should be empty again
    expect(listBoxElement).toBeEmptyDOMElement();
  });
});
