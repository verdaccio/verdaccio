/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';

import { default as IconSearch } from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

import API from '../../utils/api';
import AutoComplete from '../AutoComplete';
import colors from '../../utils/styles/colors';
import { getDetailPageURL } from '../../utils/url';

import { AutoCompleteWrapper } from './styles';

import { IProps, IState } from './types';
class Search extends Component<IProps, IState> {
  requestList: Array<any>;
  constructor(props: IProps) {
    super(props);
    this.state = {
      search: '',
      suggestions: [],
      loading: false,
      loaded: false,
      error: false,
    };
    this.requestList = [];
  }

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

  // eslint-disable-next-line no-unused-vars
  handleSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { newValue, method }: { newValue: string, method: string }) => {
    const value = newValue.trim();
    this.setState({ search: value }, () => {
      /**
       * A use case where User keeps adding and removing value in input field,
       * so we cancel all the existing requests when input is empty.
       */
      if (value.length === 0) {
        this.cancelAllSearchRequests();
      }
    });
  };

  // eslint-disable-next-line no-unused-vars
  handleClickSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { suggestionValue, method }: { suggestionValue: any[], method: string }) => {
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
  // eslint-disable-next-line no-unused-vars
  handleFetchPackages = async ({ value }: { value: string }) => {
    try {
      this.setState({
        loading: true,
        loaded: false,
        error: false,
      });
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
    } catch (_) {
      this.setState({ error: true, loaded: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  /**
   * As user focuses out from input, we cancel all the request from requestList
   * and set the API state parameters to default boolean values.
   */
  onBlur = () => {
    this.setState({ loaded: false, loading: false, error: false }, () => this.cancelAllSearchRequests());
  };

  render() {
    const { suggestions, search, loaded, loading, error } = this.state;

    return (
      <AutoCompleteWrapper>
        <AutoComplete
          suggestions={suggestions}
          suggestionsLoaded={loaded}
          suggestionsLoading={loading}
          suggestionsError={error}
          value={search}
          placeholder="Search packages"
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
