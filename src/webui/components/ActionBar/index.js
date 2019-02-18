/* eslint-disable react/jsx-max-depth */
/**
 * @prettier
 */

import React, { Component } from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import List from '@material-ui/core/List/index';

import DownloadIcon from '@material-ui/icons/CloudDownload';
import BugReportIcon from '@material-ui/icons/BugReport';
import HomeIcon from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip/index';

import { Fab, ActionListItem } from './styles';

const ACTIONS = {
  homepage: {
    icon: <HomeIcon />,
    title: 'Visit homepage',
  },
  issue: {
    icon: <BugReportIcon />,
    title: 'Open an issue',
  },
  tarball: {
    icon: <DownloadIcon />,
    title: 'Download tarball',
  },
};

class ActionBar extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {context => {
          return this.renderActionBar(context);
        }}
      </DetailContextConsumer>
    );
  }

  renderIconsWithLink(link, component) {
    if (!link) {
      return null;
    }
    return (
      <a href={link} target={"_blank"}>
        {component}
      </a>
    );
  }

  renderActionBarListItems = (packageMeta) => {
    const {
        latest: {
            bugs: {
              url: issue,
            } = {},
            homepage,
            dist: {
              tarball,
            } = {},
        } = {},
    } = packageMeta;

    const actionsMap = {
      homepage,
      issue,
      tarball,
    };

    const renderList = Object.keys(actionsMap).reduce((component, value, key) => {
      const link = actionsMap[value];
      if (link) {
        const fab = (
          <Fab size={'small'}>
            {ACTIONS[value]['icon']}
          </Fab>
        );
        component.push(
          <Tooltip key={key} title={ACTIONS[value]['title']}>
            {this.renderIconsWithLink(link, fab)}
          </Tooltip>
        );
      }
      return component;
    }, []);

    return (
      <>
        <ActionListItem alignItems={'flex-start'}>
          {renderList}
        </ActionListItem>
      </>
    );
  };

  renderActionBar = ({ packageMeta = {} }) => {
    return (
      <List>
        {this.renderActionBarListItems(packageMeta)}
      </List>
    );
  };
}

export default ActionBar;
