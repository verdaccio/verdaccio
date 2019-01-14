/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Readme from '../Readme';
import { preventXSS } from '../../utils/sec-utils';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import { Content } from './styles';
import Dependencies from '../Dependencies';

class DetailContainer extends Component<any, any> {
  state = {
    tabPosition: 0,
  };

  render() {
    return (
      <DetailContextConsumer>
        {context => {
          return this.renderTabs(context);
        }}
      </DetailContextConsumer>
    );
  }

  // $FlowFixMe
  renderTabs = ({ readMe }) => {
    const { tabPosition } = this.state;

    return (
      <React.Fragment>
        <Tabs indicatorColor={'primary'} onChange={this.handleChange} textColor={'primary'} value={tabPosition} variant={'fullWidth'}>
          <Tab label={'Readme'} />
          <Tab label={'Dependencies'} />
          <Tab label={'Versions'} />
          <Tab label={'Uplinks'} />
        </Tabs>
        <Content>
          {tabPosition === 0 && this.renderReadme(readMe)}
          {tabPosition === 1 && this.renderDependencies()}
          {tabPosition === 2 && this.renderReadme(readMe)}
          {tabPosition === 3 && this.renderReadme(readMe)}
        </Content>
      </React.Fragment>
    );
  };

  renderReadme = (readMe: string) => {
    const encodedReadme = preventXSS(readMe);

    return <Readme description={encodedReadme} />;
  };

  renderDependencies = () => {
    return <Dependencies />;
  };

  handleChange = (event: any, tabPosition: number) => {
    event.preventDefault();
    this.setState({ tabPosition });
  };
}

export default DetailContainer;
