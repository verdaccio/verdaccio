/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';
import { withRouter } from 'react-router-dom';

import { default as IconSearch } from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import debounce from 'lodash/debounce';

import API from '../../utils/api';
import AutoComplete from '../AutoComplete';
import colors from '../../utils/styles/colors';

import { IProps, IState } from './types';
import type { cancelAllSearchRequests, handlePackagesClearRequested, handleSearch, handleClickSearch, handleFetchPackages, onBlur } from './types';

const CONSTANTS = {
  API_DELAY: 300,
  PLACEHOLDER_TEXT: 'Search Packages',
  ABORT_ERROR: 'AbortError',
};

class Search extends Component<IProps, IState> {
  requestList: Array<any>;

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
  cancelAllSearchRequests: cancelAllSearchRequests = () => {
    this.requestList.forEach(request => request.abort());
    this.requestList = [];
  };

  /**
   * Cancel all the request from list and make request list empty.
   */
  handlePackagesClearRequested: handlePackagesClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  /**
   * onChange method for the input element.
   */
  handleSearch: handleSearch = (event, { newValue, method }) => {
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
  handleClickSearch: handleClickSearch = (event, { suggestionValue, method }) => {
    const { history } = this.props;
    // stops event bubbling
    event.stopPropagation();
    switch (method) {
      case 'click':
      case 'enter':
        this.setState({ search: '' });
        // $FlowFixMe
        history.push(`/-/web/version/${suggestionValue}`);
        break;
    }
  };

  /**
   * Fetch packages from API.
   * For AbortController see: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
   */
  handleFetchPackages: handleFetchPackages = async ({ value }) => {
    try {
      const controller = new window.AbortController();
      const signal = controller.signal;
      // Keep track of search requests.
      this.requestList.push(controller);
      const suggestions = await API.request(`search/${encodeURIComponent(value)}`, 'GET', { signal });
      this.setState({
        suggestions,
        loaded: true,
      });
    } catch (error) {
      /**
       * AbortError is not the API error.
       * It means browser has cancelled the API request.
       */
      if (error.name === CONSTANTS.ABORT_ERROR) {
        this.setState({ error: false, loaded: false });
      } else {
        this.setState({ error: true, loaded: false });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render(): Node {
    const { suggestions, search, loaded, loading, error } = this.state;

    return (
      <AutoComplete
        color={colors.white}
        onBlur={this.onBlur}
        onChange={this.handleSearch}
        onCleanSuggestions={this.handlePackagesClearRequested}
        onClick={this.handleClickSearch}
        onSuggestionsFetch={this.handleFetchPackages}
        placeholder={CONSTANTS.PLACEHOLDER_TEXT}
        startAdornment={this.renderAdorment()}
        suggestions={suggestions}
        suggestionsError={error}
        suggestionsLoaded={loaded}
        suggestionsLoading={loading}
        value={search}
      />
    );
  }

  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  onBlur: onBlur = event => {
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

  renderAdorment() {
    return (
      <InputAdornment position={'start'} style={{ color: colors.white }}>
        <IconSearch />
      </InputAdornment>
    );
  }
}

export default withRouter(Search);
