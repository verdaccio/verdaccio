import React, { Component } from 'react';
import API from '../../utils/api';
import Loading from '../../components/Loading';

class VersionPage extends Component<any, any> {

  state = {
    readMe: '',
    packageMeta: null,
    isLoading: true,
    notFound: false,
  };

  async componentDidMount() {
    await this.loadPackageInfo();
  }

  async loadPackageInfo() {
    const { match } = this.props;
    const packageName = match.params.package;

    this.setState({
      readMe: '',
    });

    try {
      const readMe = await API.request(`package/readme/${packageName}`, 'GET');
      const packageMeta = await API.request(`sidebar/${packageName}`, 'GET');
      this.setState({
        readMe,
        packageMeta,
        notFound: false,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        notFound: true,
        isLoading: false,
      });
    }
  }

  render() {
    const {isLoading} = this.state;

    return (
      <div>{isLoading && <Loading />}</div>
    );
  }
}

export default VersionPage;
