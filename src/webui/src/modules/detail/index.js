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

  get packageName() {
    let params = this.props.match.params;
    return `${(params.scope && '@' + params.scope + '/') || ''}${params.package}`;
  }

  async componentDidMount() {
     try {
       const resp = await API.get(`package/readme/${this.packageName}`);
       this.setState({
         readMe: resp.data
       });
     } catch (err) {
       this.setState({
         notFound: true
       });
     }
  }

  render() {
    if (this.state.notFound) {
      return <NotFound pkg={this.packageName}/>;
    } else if (isEmpty(this.state.readMe)) {
      return <Loading text={loadingMessage} />;
    }
    return (
      <div className={classes.twoColumn}>
        <PackageDetail readMe={this.state.readMe} package={this.packageName}/>
        <PackageSidebar packageName={this.packageName} />
      </div>
    );
  }
}
