import React from 'react';
import PropTypes from 'prop-types';
import {Loading, MessageBox} from 'element-react';
import isEmpty from 'lodash/isEmpty';

import API from '../../utils/api';

import PackageList from '../../components/PackageList';
import Search from '../../components/Search';

export default class Home extends React.Component {
  static propTypes = {
    children: PropTypes.element
  }

  state = {
    loading: true,
    fistTime: true,
    query: ''
  }

  constructor(props) {
    super(props);
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  componentDidMount() {
    this.loadPackages();
  }


  componentDidUpdate(prevProps, prevState) { // eslint-disable-line no-unused-vars
    if (prevState.query !== this.state.query) {
      if (this.req && this.req.abort) this.req.abort();
      this.setState({
        loading: true
      });

      if (prevState.query !== '' && this.state.query === '') {
        this.loadPackages();
      } else {
        this.setState({
          loading: false
        });
      }
    }
  }

  async loadPackages() {
    try {
      this.req = await API.request('packages', 'GET');

      if (this.state.query === '') {
        this.setState({
          packages: this.req,
          loading: false
        });
      }
    } catch (err) {
      MessageBox.msgbox({
        type: 'error',
        title: 'Warning',
        message: 'Unable to load package list: ' + err.message
      });
    }
  }

  handleSearchInput(e) {
    this.setState({
      query: e.target.value.trim()
    });
  }

  isTherePackages() {
    return isEmpty(this.state.packages);
  }

  render() {
    return (
      <div>
        {this.renderSearchBar()}
        {this.state.loading ? this.renderLoading() : this.renderPackageList()}
      </div>
    );
  }

  renderSearchBar() {
    if (this.isTherePackages() && this.state.fistTime) {
      return;
    }
    return <Search handleSearchInput={this.handleSearchInput} />;
  }

  renderLoading() {
    return <Loading text="Loading..." />;
  }

  renderPackageList() {
    let packages = [];
    packages = this.state.query ? this.getFilteredPackages(this.state.packages, this.state.query) : this.state.packages;

    return <PackageList help={this.state.fistTime} packages={packages} />;
  }

  /**
   * Method to return an array of Package that contains
   * the query in 'name' & 'description' field
   * @param {*} packages
   * @param {*} query
   */
  getFilteredPackages(packages = [], query) {
    let filteredPackages = [];
    filteredPackages = packages.filter(({name, description}) => {
      // Method to return boolean value if given string includes a query string
      // string & query are converted to lowercase to ignore capital casing typos
      let includes = (string, query) => {
        return string.toLowerCase().includes(query.toLowerCase());
      };
      return (
         includes(name, query) ||
         includes(description, query)
      );
    });
    return filteredPackages;
  }
}
