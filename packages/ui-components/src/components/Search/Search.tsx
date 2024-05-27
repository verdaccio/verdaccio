/* eslint-disable verdaccio/jsx-spread */
import SearchMui from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { SearchResultWeb } from '@verdaccio/types';

import { Dispatch, RootState, useConfig } from '../../';
import { Route } from '../../utils';
import AutoComplete from './AutoComplete';
import SearchItem from './SearchItem';
import { StyledInputAdornment, StyledTextField } from './styles';

const CONSTANTS = {
  API_DELAY: 300,
  ABORT_ERROR: 'AbortError',
};

const Search: React.FC<RouteComponentProps> = ({ history }) => {
  const { t } = useTranslation();
  const {
    configOptions: { flags },
  } = useConfig();
  const searchRemote = flags?.searchRemote || false;
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
          if (searchRemote) {
            // TODO: check this part
            // @ts-ignore
            history.push(`${Route.DETAIL}${value.package.name}`);
          } else {
            history.push(`${Route.DETAIL}${value.name}`);
          }
          break;
      }
    },
    [history, searchRemote]
  );

  /**
   * Fetch packages from API.
   * For AbortController see: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
   */
  const handleFetchPackages = useCallback(
    ({ value }: { value: string }) => {
      if (value?.trim() !== '') {
        dispatch.search.clearRequestQueue();
        dispatch.search.getSuggestions({ value });
      }
    },
    [dispatch]
  );

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

  const getOptionLabel = () => {
    if (searchRemote) {
      return (option) => {
        return option?.package?.name ?? '';
      };
    } else {
      return (option) => {
        return option?.name;
      };
    }
  };

  const renderOption = (props, option) => {
    if (searchRemote) {
      const item: SearchResultWeb = option.package;
      const isPrivate = option?.verdaccioPrivate;
      const isCached = option?.verdaccioPkgCached;
      const isRemote = !isCached && !isPrivate;
      return (
        <SearchItem
          {...props}
          description={item?.description}
          isCached={isCached}
          isPrivate={isPrivate}
          isRemote={isRemote}
          name={item?.name}
          version={item?.version}
        />
      );
    } else {
      return (
        <SearchItem
          {...props}
          description={option?.description}
          name={option?.name}
          version={option?.version}
        />
      );
    }
  };

  return (
    <AutoComplete
      getOptionLabel={getOptionLabel()}
      onCleanSuggestions={handleOnBlur}
      onSelectItem={handleClickSearch}
      onSuggestionsFetch={debounce(handleFetchPackages, CONSTANTS.API_DELAY)}
      placeholder={t('search.packages')}
      renderInput={renderInput}
      renderOption={renderOption}
      suggestions={suggestions}
      suggestionsLoading={isLoading}
    />
  );
};

export default withRouter(Search);
