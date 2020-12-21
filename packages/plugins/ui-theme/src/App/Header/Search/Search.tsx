import debounce from 'lodash/debounce';
import React, { useState, FormEvent, useCallback, useRef, useEffect } from 'react';
import { SuggestionSelectedEventData } from 'react-autosuggest';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AutoComplete from 'verdaccio-ui/components/AutoComplete';
import { callSearch } from 'verdaccio-ui/utils/calls';

import SearchAdornment from './SearchAdornment';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

const Search: React.FC<RouteComponentProps> = ({ history }) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);
  const [requestList, setRequestList] = useState<{ abort: () => void }[]>([]);

  /**
   * Cancel all the requests which are in pending state.
   */
  const cancelAllSearchRequests = useCallback(() => {
    requestList.forEach((request) => request.abort());
    setRequestList([]);
  }, [requestList, setRequestList]);

  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  const handleOnBlur = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      // stops event bubbling
      event.stopPropagation();
      setLoaded(false);
      setLoading(false);
      setError(false);
      cancelAllSearchRequests();
    },
    [setLoaded, setLoading, cancelAllSearchRequests, setError]
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

        setLoading(true);
        setError(false);
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
    setSuggestions([]);
  }, [setSuggestions]);

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
    async ({ value }: { value: string }) => {
      try {
        const controller = new window.AbortController();
        const signal = controller.signal;
        if (!mountedRef.current) {
          return null;
        }
        // Keep track of search requests.
        setRequestList([...requestList, controller]);
        const suggestions = await callSearch(value, signal);
        // FIXME: Argument of type 'unknown' is not assignable to parameter of type 'SetStateAction<never[]>'
        setSuggestions(suggestions as any);
        setLoaded(true);
      } catch (error) {
        /**
         * AbortError is not the API error.
         * It means browser has cancelled the API request.
         */
        if (error.name === CONSTANTS.ABORT_ERROR) {
          setError(false);
          setLoaded(false);
        } else {
          setError(true);
          setLoaded(false);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [requestList, setRequestList, setSuggestions, setLoaded, setError, setLoading]
  );

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
      suggestionsError={error}
      suggestionsLoaded={loaded}
      suggestionsLoading={loading}
      value={search}
    />
  );
};

export default withRouter(Search);
