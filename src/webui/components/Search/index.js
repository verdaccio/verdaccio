/**
 * @prettier
 */

import React, { Component } from 'react';

import { default as IconSearch } from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

import API from '../../utils/api';
import AutoComplete from '../AutoComplete';
import colors from '../../utils/styles/colors';
import { getDetailPageURL } from '../../utils/url';

import { AutoCompleteWrapper } from './styles';

class Search extends Component {
  constructor(props) {
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
  handleSearch = (_, { newValue }) => {
    const value = newValue.trim();
    this.setState({ search: value });
  };

  // eslint-disable-next-line no-unused-vars
  handleClickSearch = (_, { suggestionValue, method }) => {
    switch (method) {
      case 'click':
      case 'enter':
        window.location.href = getDetailPageURL(suggestionValue);
        break;
    }
  };

  handleFetchPackages = async ({ value }) => {
    try {
      this.setState({
        loading: true,
        loaded: false,
        error: false,
      });
      // Getting results from API
      this.req = await API.request(`/search/${encodeURIComponent(value)}`, 'GET');
      this.setState({ loaded: true });
      const transformedPackages = this.req.map(({ name, ...others }) => ({
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
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { suggestions, search, message, loaded, loading, error } = this.state;

    return (
      <AutoCompleteWrapper>
        <AutoComplete
          message={message}
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
          onKeyDown={this.handleKeyDown}
          onChange={this.handleSearch}
        />
      </AutoCompleteWrapper>
    );
  }
}

export default Search;
