import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'element-react';
import isEmpty from 'lodash/isEmpty';

import PackageDetail from '../../components/PackageDetail';
import NotFound from '../../components/NotFound';
import API from '../../../utils/api';

import classes from './detail.scss';
import PackageSidebar from '../../components/PackageSidebar/index';

const loadingMessage = 'Loading...';

export default class Detail extends React.Component {
  static propTypes = {
    match: PropTypes.object
  };

  state = {
    readMe: '',
    notFound: false,
  };

  getPackageName(props = this.props) {
    let params = props.match.params;
    return `${(params.scope && '@' + params.scope + '/') || ''}${params.package}`;
  }
  get packageName() {
    return this.getPackageName();
  }

  async componentDidMount() {
    await this.loadPackageInfo(this.packageName);
  }

  async componentWillReceiveProps(newProps) {
    let packageName = this.getPackageName(newProps);
    if (packageName === this.packageName) return;

    await this.loadPackageInfo(packageName);
  }

  async loadPackageInfo(packageName) {
    this.setState({
      readMe: ''
    });

    try {
      const resp = await API.request(`package/readme/${packageName}`, 'GET');
      this.setState({
        readMe: resp
      });
    } catch (err) {
      this.setState({
        notFound: true
      });
    }
  }

  render() {
    let {notFound, readMe} = this.state;

    if (notFound) {
      return <NotFound pkg={this.packageName}/>;
    } else if (isEmpty(readMe)) {
      return <Loading text={loadingMessage} />;
    }
    return (
      <div className={classes.twoColumn}>
        <PackageDetail readMe={readMe} package={this.packageName}/>
        <PackageSidebar packageName={this.packageName} />
      </div>
    );
  }
}
