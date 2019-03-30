/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Readme from '../Readme';
import Versions from '../Versions';
import { preventXSS } from '../../utils/sec-utils';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import { Content } from './styles';
import Dependencies from '../Dependencies';
import UpLinks from '../UpLinks';

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

  handleChange = (event: any, tabPosition: number) => {
    event.preventDefault();
    this.setState({ tabPosition });
  };

  // $FlowFixMe
  renderTabs = ({ readMe }) => {
    const { tabPosition } = this.state;

    return (
      <>
        <Content>
          <Tabs indicatorColor={'primary'} onChange={this.handleChange} textColor={'primary'} value={tabPosition} variant={'fullWidth'}>
            <Tab id={'readme-tab'} label={'Readme'} />
            <Tab id={'dependencies-tab'} label={'Dependencies'} />
            <Tab id={'versions-tab'} label={'Versions'} />
            <Tab id={'uplinks-tab'} label={'Uplinks'} />
          </Tabs>
          <br />
          {tabPosition === 0 && this.renderReadme(readMe)}
          {tabPosition === 1 && <Dependencies />}
          {tabPosition === 2 && <Versions />}
          {tabPosition === 3 && <UpLinks />}
        </Content>
      </>
    );
  };

  renderReadme = (readMe: string) => {
    const encodedReadme = preventXSS(readMe);

    return <Readme description={encodedReadme} />;
  };
}

export default DetailContainer;
