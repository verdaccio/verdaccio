import type { ReactElement } from 'react';
import React, { createContext, useContext } from 'react';
import useSWRMutation from 'swr/mutation';

import type { SearchResultWeb } from '@verdaccio/types';

import { fetcher } from '../../api/use-data-mutation';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';

export interface SearchContextProps {
  error: Error | undefined;
  isLoading: boolean;
  isError: boolean;
  searchResults: SearchResultWeb[];
  doSearch: (query: { text: string; signal?: AbortSignal }) => Promise<void>;
  resetSearch: () => void;
}

export const SearchContext = createContext<Partial<SearchContextProps>>({
  searchResults: [],
  isLoading: false,
});

const configuration = getConfiguration();

function useDataSearchMutation<T>(basePath: string, route: APIRoute | string, method = 'POST') {
  const key = `${basePath}${route}`;

  const { data, error, isMutating, trigger, reset } = useSWRMutation<T, any, string, any>(
    key,
    (url, { arg }) => {
      return fetcher<T>(`${url}${encodeURIComponent(arg?.text ?? '')}`, method, arg ?? {}, {
        signal: arg?.signal,
      });
    }
  );

  return { data, error, isMutating, trigger, reset };
}

export const SearchProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const basePath = stripTrailingSlash(configuration.base);

  const { data, isMutating, error, trigger, reset } = useDataSearchMutation<SearchResultWeb[]>(
    basePath,
    APIRoute.SEARCH,
    'GET'
  );

  const doSearch = async (query: { text: string; signal?: AbortSignal }) => {
    try {
      await trigger({ text: query.text, signal: query.signal });
    } catch (err: any) {
      // an abort (user kept typing or navigated away) is expected control flow;
      // real failures are surfaced through the `isError` state below
      if (err?.name !== 'AbortError') {
        console.error('Search failed:', err);
      }
    }
  };

  const value: SearchContextProps = {
    searchResults: data ?? [],
    isLoading: isMutating,
    // an aborted request (user kept typing) is not an error worth showing
    isError: !!error && error.name !== 'AbortError',
    error,
    doSearch,
    resetSearch: reset,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchProvider;

export const useSearch = () => useContext(SearchContext);
