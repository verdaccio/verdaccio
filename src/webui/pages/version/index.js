/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid/index';
import Loading from '../../components/Loading';
import DetailContainer from '../../components/DetailContainer';
import DetailSidebar from '../../components/DetailSidebar';
import { callDetailPage } from '../../utils/calls';
import { getRouterPackageName } from '../../utils/package';

export const DetailContext = React.createContext();

export const DetailContextProvider = DetailContext.Provider;
export const DetailContextConsumer = DetailContext.Consumer;

class VersionPage extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      readMe: '',
      packageName: getRouterPackageName(props.match),
      packageMeta: null,
      isLoading: true,
      notFound: false,
    };
  }

  async componentDidMount() {
    await this.loadPackageInfo();
  }

  /* eslint no-unused-vars: 0 */
  async componentDidUpdate(nextProps: any, prevState: any) {
    const { packageName } = this.state;
    if (packageName !== prevState.packageName) {
      const { readMe, packageMeta } = await callDetailPage(packageName);
      this.setState({
        readMe,
        packageMeta,
        packageName,
        notFound: false,
        isLoading: false,
      });
    }
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { match } = nextProps;
    const packageName = getRouterPackageName(match);

    if (packageName !== prevState.packageName) {
      try {
        return {
          packageName,
          isLoading: false,
        };
      } catch (err) {
        return {
          notFound: true,
          isLoading: false,
        };
      }
    } else {
      return null;
    }
  }

  async loadPackageInfo() {
    const { packageName } = this.state;
    // FIXME: use utility
    document.title = `Verdaccio - ${packageName}`;

    this.setState({
      readMe: '',
    });

    try {
      const { readMe, packageMeta } = await callDetailPage(packageName);
      this.setState({
        readMe,
        packageMeta,
        packageName,
        notFound: false,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        notFound: true,
        packageName,
        isLoading: false,
      });
    }
  }

  enableLoading = () => {
    this.setState({
      isLoading: true,
    });
  };

  render() {
    const { isLoading, packageMeta, readMe, packageName } = this.state;

    if (isLoading === false) {
      return (
        <DetailContextProvider value={{ packageMeta, readMe, packageName, enableLoading: this.enableLoading }}>
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
