import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'element-react';
import isEmpty from 'lodash/isEmpty';

import PackageDetail from '../../components/PackageDetail';
import NotFound from '../../components/NotFound';
import API from '../../../utils/api';

const loadingMessage = 'Loading...';

export default class Detail extends React.Component {
  static propTypes = {
    match: PropTypes.object
  };

  state = {
    readMe: '',
    notFound: false,
  };

  async componentDidMount() {
     try {
       const resp = await API.get(`package/readme/${this.props.match.params.package}`);
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
      return <NotFound
          pkg={this.props.match.params.package}/>;
    } else if (isEmpty(this.state.readMe)) {
      return <Loading text={loadingMessage} />;
    }
    return <PackageDetail readMe={this.state.readMe} package={this.props.match.params.package}/>;
  }
}
