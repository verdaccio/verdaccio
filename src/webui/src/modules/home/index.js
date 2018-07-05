import React from 'react';
import PropTypes from 'prop-types';
import {Loading, MessageBox} from 'element-react';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';

import API from '../../../utils/api';

import PackageList from '../../components/PackageList';
import Search from '../../components/Search';

import classes from './home.scss';


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
    this.searchPackage = debounce(this.searchPackage, 800);
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
        this.searchPackage(this.state.query);
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

  async searchPackage(query) {
   try {
     this.req = await API.request(`/search/${query}`, 'GET');

     // Implement cancel feature later
     if (this.state.query === query) {
       this.setState({
         packages: this.req,
         fistTime: false,
         loading: false
       });
     }
   } catch (err) {
     MessageBox.msgbox({
       type: 'error',
       title: 'Warning',
       message: 'Unable to get search result, please try again later.'
     });
   }
  }

  handleSearchInput(e) {
    this.setState({
      query: e.target.value
    });
  }

  isTherePackages() {
    return isEmpty(this.state.packages);
  }

  render() {
    return (
        <div className={ classes.container }>
          { this.renderSearchBar() }
          { this.state.loading ? this.renderLoading() : this.renderPackageList() }
        </div>
    );
  }

  renderSearchBar() {
    if (this.isTherePackages() && this.state.fistTime) {
      return;
    }
    return <Search handleSearchInput={ this.handleSearchInput } />;
  }

  renderLoading() {
    return <Loading text="Loading..." />;
  }

  renderPackageList() {
    return <PackageList help={this.state.fistTime} packages={this.state.packages} />;
  }
}
