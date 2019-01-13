import React, {Component} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Readme from '../Readme';
import {preventXSS} from '../../utils/sec-utils';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import { Content } from './styles';

class DetailContainer extends Component<any, any> {
  state = {
    tabPosition: 0,
  };

  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderTabs(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderTabs = ({readMe}) => {
    const { tabPosition } = this.state;

    return (
      <React.Fragment>
        <Tabs indicatorColor={'primary'} onChange={this.handleChange} textColor={'primary'} value={tabPosition} variant={'fullWidth'}>
          <Tab label={'Readme'} />
          <Tab label={'Dependencies'} />
          <Tab label={'Versions'} />
          <Tab label={'Uplinks'} />
        </Tabs>
        {tabPosition === 0 && this.renderReadme(readMe)}
      </React.Fragment>
    );
  }

  renderReadme = (readMe) => {
    const encodedReadme = preventXSS(readMe);

    return (<Content><Readme description={encodedReadme}></Readme></Content>);
  }
}


export default DetailContainer;
