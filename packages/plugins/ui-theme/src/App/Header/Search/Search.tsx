import debounce from 'lodash/debounce';
import React, { FormEvent, useCallback, useState } from 'react';
import { SuggestionSelectedEventData } from 'react-autosuggest';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import AutoComplete from 'verdaccio-ui/components/AutoComplete';

import { Dispatch, RootState } from '../../../store/store';
import SearchAdornment from './SearchAdornment';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

const Search: React.FC<RouteComponentProps> = ({ history }) => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  // const mountedRef = useRef(true);
  const { isError, suggestions } = useSelector((state: RootState) => state.search);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.search);
  const dispatch = useDispatch<Dispatch>();
  /**
   * Cancel all the requests which are in pending state.
   */
  const cancelAllSearchRequests = useCallback(() => {
    dispatch.search.clearRequestQueue();
  }, [dispatch]);

  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  const handleOnBlur = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      // stops event bubbling
      event.stopPropagation();
      cancelAllSearchRequests();
    },
    [cancelAllSearchRequests]
  );

  /**
   * onChange method for the input element.
   */
  const handleSearch = useCallback(
    (event: FormEvent<HTMLInputElement>, { newValue, method }) => {
      // stops event bubbling
      event.stopPropagation();
      if (method === 'type') {
        const value = newValue.trim();
        setSearch(value);
        setLoaded(false);
        /**
         * A use case where User keeps adding and removing value in input field,
         * so we cancel all the existing requests when input is empty.
         */
        if (value?.length === 0) {
          cancelAllSearchRequests();
        }
      }
    },
    [cancelAllSearchRequests]
  );

  /**
   * Cancel all the request from list and make request list empty.
   */
  const handlePackagesClearRequested = useCallback(() => {
    dispatch.search.saveSearch({ suggestions: [] });
  }, [dispatch]);

  /**
   * When an user select any package by clicking or pressing return key.
   */
  const handleClickSearch = useCallback(
    (
      event: FormEvent<HTMLInputElement>,
      { suggestionValue, method }: SuggestionSelectedEventData<unknown>
    ): void | undefined => {
      // stops event bubbling
      event.stopPropagation();
      switch (method) {
        case 'click':
        case 'enter':
          setSearch('');
          history.push(`/-/web/detail/${suggestionValue}`);
          break;
      }
    },
    [history]
  );

  /**
   * Fetch packages from API.
   * For AbortController see: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
   */
  const handleFetchPackages = useCallback(
    ({ value }: { value: string }) => {
      dispatch.search.getSuggestions({ value });
    },
    [dispatch]
  );

  return (
    <AutoComplete
      onBlur={handleOnBlur}
      onChange={handleSearch}
      onCleanSuggestions={handlePackagesClearRequested}
      onClick={handleClickSearch}
      onSuggestionsFetch={debounce(handleFetchPackages, CONSTANTS.API_DELAY)}
      placeholder={t('search.packages')}
      startAdornment={<SearchAdornment />}
      suggestions={suggestions}
      suggestionsError={isError}
      suggestionsLoaded={loaded}
      suggestionsLoading={isLoading}
      value={search}
    />
  );
};

export default withRouter(Search);
