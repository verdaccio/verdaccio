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
  constructor(props: IProps) {
    super(props);

    this.state = {
      search: '',
      suggestions: [],
      loading: false,
      loaded: false,
      error: false,
    };
  }

  handlePackagesClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // eslint-disable-next-line no-unused-vars
  handleSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { newValue, method }: { newValue: string, method: string }) => {
    const value = newValue.trim();
    this.setState({ search: value });
  };

  // eslint-disable-next-line no-unused-vars
  handleClickSearch = (event: SyntheticKeyboardEvent<HTMLInputElement>, { suggestionValue, method }: { suggestionValue: any[], method: string }) => {
    switch (method) {
      case 'click':
      case 'enter':
        // clear all filters before moving to a new page
        this.setState({
          search: '',
        });
        window.location.href = getDetailPageURL(suggestionValue);
        break;
    }
  };

  // eslint-disable-next-line no-unused-vars
  handleFetchPackages = async ({ value }: { value: string }) => {
    try {
      this.setState({
        loading: true,
        loaded: false,
        error: false,
      });
      // Getting results from API
      const response = await API.request(`search/${encodeURIComponent(value)}`, 'GET');
      this.setState({ loaded: true });
      const transformedPackages = response.map(({ name, ...others }) => ({
        label: name,
        ...others,
      }));
      // Implement cancel feature later
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
        />
      </AutoCompleteWrapper>
    );
  }
}

export default Search;
