import debounce from 'lodash/debounce';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import AutoComplete from 'verdaccio-ui/components/AutoComplete';

import { SearchResultWeb } from '@verdaccio/types';

import { Dispatch, RootState } from '../../../store/store';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

const Search: React.FC<RouteComponentProps> = ({ history }) => {
  const { t } = useTranslation();
  const { suggestions } = useSelector((state: RootState) => state.search);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.search);
  const dispatch = useDispatch<Dispatch>();
  /**
   * Cancel all the requests which are in pending state.
   */
  const cancelAllSearchRequests = useCallback(() => {
    dispatch.search.clearRequestQueue();
    dispatch.search.saveSearch({ suggestions: [] });
  }, [dispatch]);

  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  const handleOnBlur = useCallback(
    (event: React.SyntheticEvent) => {
      // stops event bubbling
      event.stopPropagation();
      cancelAllSearchRequests();
    },
    [cancelAllSearchRequests]
  );

  /**
   * When an user select any package by clicking or pressing return key.
   */
  const handleClickSearch = useCallback(
    (event: React.SyntheticEvent, value: SearchResultWeb, reason: string): void => {
      // stops event bubbling
      event.stopPropagation();
      switch (reason) {
        case 'selectOption':
          history.push(`/-/web/detail/${value.name}`);
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
      if (value?.trim() !== '') {
        dispatch.search.getSuggestions({ value });
      }
    },
    [dispatch]
  );

  return (
    <AutoComplete
      onCleanSuggestions={handleOnBlur}
      onSelectItem={handleClickSearch}
      onSuggestionsFetch={debounce(handleFetchPackages, CONSTANTS.API_DELAY)}
      placeholder={t('search.packages')}
      suggestions={suggestions}
      suggestionsLoading={isLoading}
    />
  );
};

export default withRouter(Search);
