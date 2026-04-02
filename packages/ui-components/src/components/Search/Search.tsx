import SearchMui from '@mui/icons-material/Search';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { SearchResultWeb } from '@verdaccio/types';

import { useConfig, useSearch } from '../../';
import { Route } from '../../utils';
import AutoComplete from './AutoComplete';
import SearchItem from './SearchItem';
import { StyledInputAdornment, StyledTextField } from './styles';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

const Search: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { searchResults, isLoading, doSearch } = useSearch();
  const {
    configOptions: { flags },
  } = useConfig();
  const searchRemote = flags?.searchRemote ?? false;

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelAllSearchRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleOnBlur = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      cancelAllSearchRequests();
    },
    [cancelAllSearchRequests]
  );

  const handleClickSearch = useCallback(
    (event: React.SyntheticEvent, value: SearchResultWeb, reason: string): void => {
      event.stopPropagation();
      if (reason === 'selectOption') {
        const pkgName = value['package']?.name ?? value.name;
        navigate(`${Route.DETAIL}${pkgName}`);
      }
    },
    [navigate, searchRemote]
  );

  // Use a ref to always access the latest doSearch without re-creating the debounced function
  const doSearchRef = useRef(doSearch);
  doSearchRef.current = doSearch;

  /**
   * Stable fetch function that reads the latest doSearch from a ref,
   * avoiding dependency changes that would break the debounce.
   */
  const handleFetchPackages = useCallback(
    async ({ value }: { value: string }) => {
      if (value?.trim() !== '') {
        // Abort any previous pending request before starting a new one
        cancelAllSearchRequests();

        // Create a new controller for the current request
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          await doSearchRef.current?.({
            text: value,
            signal: controller.signal,
          });
        } catch (err: any) {
          if (err.name === CONSTANTS.ABORT_ERROR) {
            console.warn('Search request aborted');
          } else {
            console.error('Search error:', err);
          }
        }
      }
    },
    [cancelAllSearchRequests]
  );

  // Memoize the debounced function so a single instance is reused across renders,
  // ensuring the debounce timer works correctly instead of creating a new timer per render.
  const debouncedFetch = useMemo(
    () => debounce(handleFetchPackages, CONSTANTS.API_DELAY),
    [handleFetchPackages]
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel?.();
      cancelAllSearchRequests();
    };
  }, [debouncedFetch, cancelAllSearchRequests]);

  const renderOption = (props, option) => {
    const { key, ...otherProps } = props;

    if (searchRemote) {
      const item: SearchResultWeb = option.package;
      const isPrivate = option?.verdaccioPrivate;
      const isCached = option?.verdaccioPkgCached;
      const isRemote = !isCached && !isPrivate;
      return (
        <SearchItem
          key={key}
          {...otherProps}
          description={item?.description}
          isCached={isCached}
          isPrivate={isPrivate}
          isRemote={isRemote}
          name={item?.name}
          version={item?.version}
        />
      );
    } else {
      const item: SearchResultWeb = option.package;
      return (
        <SearchItem
          key={key}
          {...otherProps}
          description={item?.description}
          name={item?.name}
          version={item?.version}
        />
      );
    }
  };

  const renderInput = (params) => {
    return (
      <StyledTextField
        {...params}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <StyledInputAdornment position="start">
              <SearchMui />
            </StyledInputAdornment>
          ),
        }}
        label=""
        placeholder={t('search.packages')}
        variant="standard"
      />
    );
  };

  const getOptionLabel = (option) => {
    return option?.package?.name;
  };

  return (
    <AutoComplete
      getOptionLabel={getOptionLabel}
      onCleanSuggestions={handleOnBlur}
      onSelectItem={handleClickSearch}
      onSuggestionsFetch={debouncedFetch}
      placeholder={t('search.packages')}
      renderInput={renderInput}
      renderOption={renderOption}
      suggestions={searchResults}
      suggestionsLoading={isLoading}
    />
  );
};

export default Search;
