/* eslint react/jsx-max-depth: 0 */

import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { DetailContextConsumer } from '../../pages/version/index';
import CopyToClipBoard from '../CopyToClipBoard';
import Github from '../../icons/GitHub';

import {Heading} from './styles';

class Repository extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderRepository(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderRepository = ({packageMeta}) => {
    const { repository } = packageMeta.latest;
    if (!repository) {
      return null;
    }

    const { url } = repository;
    return (
      <>
        <List dense={true} subheader={<Heading variant={"subheading"}>{'Repository'}</Heading>}>
          <ListItem>
            <Avatar>
              <Github style={{ fontSize: 45, backgroundColor: '#24292e' }} />
            </Avatar>
            <ListItemText primary={<CopyToClipBoard text={<a href={url}>{url}</a>} />} />
          </ListItem>
        </List>
      </>
    );
  }
}


export default Repository;
