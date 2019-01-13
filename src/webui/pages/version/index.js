/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import API from '../../utils/api';
import Grid from '@material-ui/core/Grid/index';
import Loading from '../../components/Loading';
import DetailContainer from '../../components/DetailContainer';
import DetailSidebar from '../../components/DetailSidebar';

export const DetailContext = React.createContext();

export const DetailContextProvider = DetailContext.Provider;
export const DetailContextConsumer = DetailContext.Consumer;

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
    // FIXME: use utility
    document.title = `Verdaccio - ${packageName}`;

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
    const { isLoading, packageMeta, readMe } = this.state;
    const { match } = this.props;
    const packageName = match.params.package;

    if (isLoading === false) {
      return (
        <DetailContextProvider value={{ packageMeta, readMe, packageName }}>
          <Grid className={'container content'} container={true} spacing={0}>
            <Grid item={true} xs={8}>
              {this.renderDetail()}
            </Grid>
            <Grid item={true} xs={4}>
              {this.renderSidebar()}
            </Grid>
          </Grid>
        </DetailContextProvider>
      );
    } else {
      return <Loading />;
    }
  }

  renderDetail() {
    return <DetailContainer />;
  }

  renderSidebar() {
    return <DetailSidebar />;
  }
}

export default VersionPage;
