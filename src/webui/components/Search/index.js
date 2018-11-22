/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import { default as IconSearch } from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import debounce from 'lodash/debounce';

import API from '../../utils/api';
import AutoComplete from '../AutoComplete';
import colors from '../../utils/styles/colors';
import { getDetailPageURL } from '../../utils/url';

import { AutoCompleteWrapper } from './styles';
import { IProps, IState } from './types';

const CONSTANTS = {
  API_DELAY: 300,
  PLACEHOLDER_TEXT: 'Search Packages',
  ABORT_ERROR: 'AbortError',
};

class Search extends Component<IProps, IState> {
  requestList: Array<any>;
  cancelAllSearchRequests: Function;
  handlePackagesClearRequested: Function;
  handleSearch: Function;
  handleClickSearch: Function;
  handleFetchPackages: Function;
  onBlur: Function;

  constructor(props: IProps) {
    super(props);
    this.state = {
      search: '',
      suggestions: [],
      // loading: A boolean value to indicate that request is in pending state.
      loading: false,
      // loaded: A boolean value to indicate that result has been loaded.
      loaded: false,
      // error: A boolean value to indicate API error.
      error: false,
    };
    this.requestList = [];
    this.handleFetchPackages = debounce(this.handleFetchPackages, CONSTANTS.API_DELAY);
  }

  /**
   * Cancel all the requests which are in pending state.
   */
  cancelAllSearchRequests = () => {
    this.requestList.forEach(request => request.abort());
    this.requestList = [];
  };

  /**
   * Cancel all the request from list and make request list empty.
   */
  handlePackagesClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  /**
   * onChange method for the input element.
   */
  handleSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { newValue, method }: { newValue: string, method: string }) => {
    // stops event bubbling
    event.stopPropagation();
    if (method === 'type') {
      const value = newValue.trim();
      this.setState(
        {
          search: value,
          loading: true,
          loaded: false,
          error: false,
        },
        () => {
          /**
           * A use case where User keeps adding and removing value in input field,
           * so we cancel all the existing requests when input is empty.
           */
          if (value.length === 0) {
            this.cancelAllSearchRequests();
          }
        }
      );
    }
  };

  /**
   * When an user select any package by clicking or pressing return key.
   */
  handleClickSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { suggestionValue, method }: { suggestionValue: Array<Object>, method: string }) => {
    // stops event bubbling
    event.stopPropagation();
    switch (method) {
      case 'click':
      case 'enter':
        this.setState({ search: '' });
        window.location.href = getDetailPageURL(suggestionValue);
        break;
    }
  };

  /**
   * Fetch packages from API.
   * For AbortController see: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
   */
  handleFetchPackages = async ({ value }: { value: string }) => {
    try {
      const controller = new window.AbortController();
      const signal = controller.signal;
      // Keep track of search requests.
      this.requestList.push(controller);
      const response = await API.request(`search/${encodeURIComponent(value)}`, 'GET', { signal });
      this.setState({ loaded: true });
      const transformedPackages = response.map(({ name, ...others }) => ({
        label: name,
        ...others,
      }));
      if (this.state.search === value) {
        this.setState({
          suggestions: transformedPackages,
          loaded: true,
        });
      }
    } catch (error) {
      /**
       * AbortError is not the API error.
       * It means browser has cancelled the API request.
       */
      if (error.name !== CONSTANTS.ABORT_ERROR) {
        this.setState({ error: true, loaded: false });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  onBlur = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    // stops event bubbling
    event.stopPropagation();
    this.setState(
      {
        loaded: false,
        loading: false,
        error: false,
      },
      () => this.cancelAllSearchRequests()
    );
  };

  render(): Node {
    const { suggestions, search, loaded, loading, error } = this.state;

    return (
      <AutoCompleteWrapper>
        <AutoComplete
          suggestions={suggestions}
          suggestionsLoaded={loaded}
          suggestionsLoading={loading}
          suggestionsError={error}
          value={search}
          placeholder={CONSTANTS.PLACEHOLDER_TEXT}
          color={colors.white}
          startAdornment={
            <InputAdornment position="start" style={{ color: colors.white }}>
              <IconSearch />
            </InputAdornment>
          }
          onSuggestionsFetch={this.handleFetchPackages}
          onCleanSuggestions={this.handlePackagesClearRequested}
          onClick={this.handleClickSearch}
          onChange={this.handleSearch}
          onBlur={this.onBlur}
        />
      </AutoCompleteWrapper>
    );
  }
}

export default Search;
