import { debounce } from 'lodash-es';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { SearchProvider } from '../../';
import { mockSearch } from '../../../vitest/msw-utils';
import { server } from '../../../vitest/server';
import {
  fireEvent,
  renderWith,
  renderWithRouteDetail,
  screen,
  waitFor,
} from '../../test/test-react-testing-library';
import Search from './Search';
import SearchItem from './SearchItem';
import { SearchOrigin, cleanDescription, normalizeSearchOption, sortByOrigin } from './utils';

vi.mock('lodash-es', async () => {
  const actual = await vi.importActual('lodash-es');
  return {
    ...actual,
    debounce: vi.fn((fn) => {
      // Immediately execute the function for testing
      const debounced = (...args: any[]) => fn(...args);
      debounced.cancel = vi.fn();
      return debounced;
    }),
  };
});

const mockedDebounce = vi.mocked(debounce);

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

  test('handleSearch: when user type package name in search component, show suggestions', async () => {
    renderWithRouteDetail(<ComponentToBeRendered />);

    const autoCompleteInput = screen.getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: '@verdaccio/file-locking' } });

    // Clear any abort calls triggered by providers (VersionProvider, etc.) during render
    abortSpy.mockClear();

    // forcing abort to be called in the search function, to make sure that the previous request is cancelled when user types a new value
    fireEvent.change(autoCompleteInput, { target: { value: '@verdaccio/file' } });

    expect(autoCompleteInput).toHaveAttribute('value', '@verdaccio/file');

    const suggestionsElements = await screen.findAllByText('@verdaccio/file-locking', {
      exact: true,
    });

    expect(suggestionsElements).toHaveLength(1);
    expect(abortSpy).toHaveBeenCalled();
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

  test('should create a stable debounced function via useMemo', () => {
    renderWithRouteDetail(<ComponentToBeRendered />);
    // debounce should be called once on mount with the fetch handler and 300ms delay
    expect(mockedDebounce).toHaveBeenCalledWith(expect.any(Function), 300);
    const callCount = mockedDebounce.mock.calls.length;

    // re-render should not create a new debounced instance
    renderWithRouteDetail(<ComponentToBeRendered />);
    // debounce is called once per mount, not on every render
    expect(mockedDebounce).toHaveBeenCalledTimes(callCount * 2);
  });

  test('should cancel debounced function and abort requests on unmount', async () => {
    const { unmount, getByPlaceholderText } = renderWithRouteDetail(<ComponentToBeRendered />);

    // get the cancel mock from the last debounced function created
    const lastDebouncedFn = mockedDebounce.mock.results[mockedDebounce.mock.results.length - 1]
      .value as any;

    const autoCompleteInput = getByPlaceholderText('search.packages');

    // trigger a search so there's an active AbortController
    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'verdaccio' } });

    await waitFor(() => {
      expect(autoCompleteInput).toHaveAttribute('value', 'verdaccio');
    });

    abortSpy.mockClear();
    unmount();

    // cleanup effect should cancel debounce and abort pending requests
    expect(lastDebouncedFn.cancel).toHaveBeenCalled();
    expect(abortSpy).toHaveBeenCalled();
  });

  test('should not fetch when search value is only whitespace', async () => {
    renderWithRouteDetail(<ComponentToBeRendered />);
    const autoCompleteInput = screen.getByPlaceholderText('search.packages');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: '   ' } });

    // no abort should be called since no request was started
    expect(abortSpy).not.toHaveBeenCalled();
  });

  describe('local and cached results', () => {
    const result = (
      name: string,
      flags: { verdaccioPrivate?: boolean; verdaccioPkgCached?: boolean }
    ) => ({
      package: { name, version: '1.0.0', description: `${name} description` },
      ...flags,
    });
    const mixedResults = [
      result('react-dom', {}),
      result('react', { verdaccioPkgCached: true }),
      result('@verdaccio/ui-components', { verdaccioPrivate: true }),
      result('react-router', {}),
    ];

    const typeQuery = async (showUplinks: boolean) => {
      window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = showUplinks;
      server.use(mockSearch(mixedResults));
      renderWithRouteDetail(<ComponentToBeRendered />);
      const input = screen.getByPlaceholderText('search.packages');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'react' } });
      await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(4), { timeout: 3000 });
    };

    test('groups results as published here, cached and remote when uplinks are shown', async () => {
      await typeQuery(true);
      const groups = ['private', 'cached', 'remote'].map((group) =>
        screen.getByTestId(`search-group-${group}`)
      );
      expect(groups.map((group) => group.textContent)).toEqual([
        'search.group.private',
        'search.group.cached',
        'search.group.remote',
      ]);
      expect(
        screen.getAllByRole('option').map((option) => option.querySelector('span')?.textContent)
      ).toEqual(['@verdaccio/ui-components', 'react', 'react-dom', 'react-router']);
    });

    test('lists results flat and without origin icons when uplinks are hidden', async () => {
      await typeQuery(false);
      expect(screen.queryByTestId('search-group-private')).not.toBeInTheDocument();
      expect(screen.queryByTestId('search-origin-private')).not.toBeInTheDocument();
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('react-dom');
      window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = true;
    });
  });
});

describe('<SearchItem />', () => {
  test('labels the origin icon for assistive technology', () => {
    renderWith(<SearchItem isCached={true} name="react" version="19.2.0" />, { showUplinks: true });
    expect(screen.getByTitle('search.origin.cached')).toBeInTheDocument();
    expect(screen.getByText('19.2.0')).toBeInTheDocument();
  });
});

describe('search origin helpers', () => {
  test('derives the origin from the verdaccio flags', () => {
    expect(normalizeSearchOption({ package: { name: 'a' }, verdaccioPrivate: true }).origin).toBe(
      SearchOrigin.PRIVATE
    );
    expect(normalizeSearchOption({ package: { name: 'a' }, verdaccioPkgCached: true }).origin).toBe(
      SearchOrigin.CACHED
    );
    expect(normalizeSearchOption({ package: { name: 'a' } }).origin).toBe(SearchOrigin.REMOTE);
    expect(normalizeSearchOption({ name: 'flat' }).origin).toBeUndefined();
  });

  test('sorts private, cached, remote and keeps the server order inside each group', () => {
    const options = [
      { package: { name: 'remote-1' } },
      { package: { name: 'cached-1' }, verdaccioPkgCached: true },
      { package: { name: 'remote-2' } },
      { package: { name: 'private-1' }, verdaccioPrivate: true },
    ];
    expect(sortByOrigin(options).map((option) => option.package.name)).toEqual([
      'private-1',
      'cached-1',
      'remote-1',
      'remote-2',
    ]);
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

  test('should remove markdown links', () => {
    const description = '[![NPM version](https://img.shields.io/npm/latest.svg)]';
    const output = cleanDescription(description);
    expect(output).toBe('NPM version');
  });
});
