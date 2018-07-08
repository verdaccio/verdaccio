import React from 'react';
import PropTypes from 'prop-types';
import LastSync from './modules/LastSync';
import Maintainers from './modules/Maintainers';
import Dependencies from './modules/Dependencies';
import Infos from './modules/Infos';

import API from '../../../utils/api';

export default class PackageSidebar extends React.Component {
  state = {};

  static propTypes = {
    packageName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.loadPackageData = this.loadPackageData.bind(this);
  }

  async componentDidMount() {
    await this.loadPackageData(this.props.packageName);
  }

  async componentWillReceiveProps(newProps) {
    if (newProps.packageName !== this.props.packageName) {
      await this.loadPackageData(newProps.packageName);
    }
  }

  async loadPackageData(packageName) {
    let packageMeta;

    try {
      packageMeta = await API.request(`sidebar/${packageName}`, 'GET');
    } catch (err) {
      this.setState({
        failed: true
      });
      return;
    }

    this.setState({
      packageMeta
    });
  }

  render() {
    let {packageMeta} = this.state;

    return packageMeta ?
      (<aside className="sidebar-info">
        <LastSync packageMeta={packageMeta} />
        <Infos packageMeta={packageMeta} />
        <Maintainers packageMeta={packageMeta} />
        <Dependencies packageMeta={packageMeta} />
        {/* Package management module? Help us implement it! */}
      </aside>):
      (<aside className="sidebar-loading">Loading package information...</aside>);
  }
}
