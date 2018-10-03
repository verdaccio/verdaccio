import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import PackageDetail from '../../components/PackageDetail';
import NotFound from '../../components/NotFound';
import Spinner from '../../components/Spinner';
import API from '../../utils/api';

import Header from '../../components/Header';

import classes from './detail.scss';
import PackageSidebar from '../../components/PackageSidebar/index';

export default class Detail extends Component {
  static propTypes = {
    match: PropTypes.object,
    isUserLoggedIn: PropTypes.bool
  };

  state = {
    readMe: '',
    notFound: false
  };

  getPackageName(props = this.props) {
    const params = props.match.params;
    return `${(params.scope && '@' + params.scope + '/') || ''}${
      params.package
    }`;
  }
  get packageName() {
    return this.getPackageName();
  }

  async componentDidMount() {
    await this.loadPackageInfo(this.packageName);
  }

  componentDidUpdate(prevProps) {
    const condition1 = prevProps.isUserLoggedIn !== this.props.isUserLoggedIn;
    const condition2 =
      prevProps.match.params.package !== this.props.match.params.package;
    if (condition1 || condition2) {
      const packageName = this.getPackageName(this.props);
      this.loadPackageInfo(packageName);
    }
  }

  async loadPackageInfo(packageName) {
    this.setState({
      readMe: ''
    });

    try {
      const resp = await API.request(`package/readme/${packageName}`, 'GET');
      this.setState({
        readMe: resp,
        notFound: false
      });
    } catch (err) {
      this.setState({
        notFound: true
      });
    }
  }

  render() {
    const { notFound, readMe } = this.state;

    if (notFound) {
      return (
        <Fragment>
           <Header {...this.props} withoutSearch />
           <NotFound pkg={this.packageName} />
        </Fragment>
      );
    } else if (isEmpty(readMe)) {
      return <Spinner centered />;
    }
    return (
      <Fragment>
        <Header {...this.props} withoutSearch />
        <div className={`container content ${classes.twoColumn}`}>
          <PackageDetail readMe={readMe} packageName={this.packageName} />
          <PackageSidebar packageName={this.packageName} />
        </div>
      </Fragment> 
    );
  }
}
