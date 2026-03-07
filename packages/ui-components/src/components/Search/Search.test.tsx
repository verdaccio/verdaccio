import React from 'react';
import { vi } from 'vitest';

import { SearchProvider } from '../../';
import {
  fireEvent,
  renderWithRouteDetail,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import Search from './Search';
import { cleanDescription } from './utils';

vi.mock('lodash/debounce', () => ({
  default: vi.fn((fn) => {
    // Immediately execute the function for testing
    return (...args: any[]) => fn(...args);
  }),
}));

// Add this near the top of your test file, outside describe blocks
const abortSpy = vi.spyOn(AbortController.prototype, 'abort');

const ComponentToBeRendered: React.FC = () => (
  <SearchProvider>
    <Search />
  </SearchProvider>
);

describe('<Search /> component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should load the component in default state', () => {
    renderWithRouteDetail(<ComponentToBeRendered />);
    expect(screen.getByPlaceholderText('search.packages')).toBeInTheDocument();
  });

  test('should load the component in default state with remote search', () => {
    renderWithRouteDetail(<ComponentToBeRendered />, 'jquery', { flags: { searchRemote: true } });
    expect(screen.getByPlaceholderText('search.packages')).toBeInTheDocument();
  });

  test('handleSearch: when user type package name in search component, show suggestions', async () => {
    renderWithRouteDetail(<ComponentToBeRendered />);

    const autoCompleteInput = screen.getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: '@verdaccio/file-locking' } });
    // forcing abort to be called in the search function, to make sure that the previous request is cancelled when user types a new value
    fireEvent.change(autoCompleteInput, { target: { value: '@verdaccio/file' } });

    expect(autoCompleteInput).toHaveAttribute('value', '@verdaccio/file');

    const suggestionsElements = await screen.findAllByText('@verdaccio/file-locking', {
      exact: true,
    });

    expect(suggestionsElements).toHaveLength(1);
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });

  test('onBlur: should cancel all search requests', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithRouteDetail(
      <ComponentToBeRendered />
    );

    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(1);

    fireEvent.blur(autoCompleteInput);
    const listBoxElement = screen.queryAllByRole('listbox');
    expect(listBoxElement).toHaveLength(0);
  });

  test('handleSearch: cancel all search requests when there is no value in search component with type method', async () => {
    const { getByPlaceholderText } = renderWithRouteDetail(<ComponentToBeRendered />);

    const autoCompleteInput = getByPlaceholderText('search.packages');
    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: ' ', method: 'type' } });
    expect(autoCompleteInput).toHaveAttribute('value', ' ');
    const listBoxElement = screen.queryAllByRole('listbox');
    expect(listBoxElement).toHaveLength(0);
  });

  test('handleSearch: when method is not type method', async () => {
    const { getByPlaceholderText } = renderWithRouteDetail(<ComponentToBeRendered />);

    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: ' ', method: 'click' } });
    expect(autoCompleteInput).toHaveAttribute('value', ' ');
    const listBoxElement = screen.queryAllByRole('listbox');
    expect(listBoxElement).toHaveLength(0);
  });

  test('handlePackagesClearRequested: should clear suggestions', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithRouteDetail(
      <ComponentToBeRendered />
    );
    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));
    expect(suggestionsElements).toHaveLength(1);

    fireEvent.change(autoCompleteInput, { target: { value: ' ' } });
    const listBoxElement = screen.queryAllByRole('listbox');
    // when the page redirects, the list box should be empty again
    expect(listBoxElement).toHaveLength(0);
  });

  test('handleClickSearch: should change the window location on click or return key', async () => {
    const { getByPlaceholderText, findAllByText } = renderWithRouteDetail(
      <ComponentToBeRendered />
    );
    const autoCompleteInput = getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });
    expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');

    const suggestionsElements = await waitFor(() => findAllByText('verdaccio', { exact: true }));

    expect(suggestionsElements).toHaveLength(1);
    // click on the second suggestion
    fireEvent.click(suggestionsElements[0]);
    const listBoxElement = screen.queryAllByRole('listbox');
    // // when the page redirects, the list box should be empty again
    expect(listBoxElement).toHaveLength(0);
  }, 5000);

  test.todo('handle SearchItem properties, isPrivate, isRemote, isCached');
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

  test('should remove markdown links', () => {
    const description = '[![NPM version](https://img.shields.io/npm/latest.svg)]';
    const output = cleanDescription(description);
    expect(output).toBe('NPM version');
  });
});
