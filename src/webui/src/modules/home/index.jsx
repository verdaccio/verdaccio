import React from 'react';
import PropTypes from 'prop-types';
import { Loading, MessageBox } from 'element-react';

import API from '../../../utils/API';

import PackageList from '../../components/PackageList'

import classes from './home.scss';


export default class Home extends React.Component {
  static propTypes = {
    children:  PropTypes.element
  }

  state = {
    loading: true,
    query: ''
  }

  constructor (props) {
    super(props);
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  componentDidMount () {
    this.loadPackages();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      if (this.req && this.req.abort) this.req.abort();
      this.setState({
        loading: true
      });

      if (prevState.query !== '' && this.state.query === '') {
        this.loadPackages();
      } else {
        this.searchPackage(this.state.query)
      }
    }
  }

  async loadPackages () {
    try {
      this.req = await API.get('packages');

      if (this.state.query === '') {
        this.setState({
          packages: this.req.data,
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

  async searchPackage (query) {
   try {
     this.req = await API.get(`/search/${query}`);

     // Implement cancel feature later
     if (this.state.query === query) {
       this.setState({
         packages: this.req.data,
         loading: false
       });
     }
   } catch (err) {
     MessageBox.msgbox({
       type: 'error',
       title: 'Warning',
       message: 'Unable to get search result, please try again later.'
     })
   }
  }

  handleSearchInput (e) {
    this.setState({
      query: e.target.value
    });
  }

  renderLoading () {
    return (
        <Loading text="Loading..." />
    )
  }

  renderPackageList () {
    return (
        <div>
          <h1 className={ classes.listTitle }>Available Packages</h1>
          <PackageList packages={this.state.packages} />
        </div>
    )
  }

  render() {
    return (
        <div className={ classes.container }>
          <input
              type="text"
              placeholder="Type to search..."
              className={ classes.searchBox }
              onChange={ this.handleSearchInput }
          />
          { this.state.loading ? this.renderLoading() : this.renderPackageList() }
        </div>
    )
  }
}
