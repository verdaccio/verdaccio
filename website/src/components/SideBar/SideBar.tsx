import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';

export type SideBarProps = {
  lng: string;
  sideBarConf: any;
  currentPage: string;
  idTitleMap: any;
};

const SideBar: FunctionComponent<SideBarProps> = (props) => {
  const { sideBarConf, idTitleMap, currentPage, lng } = props;
  console.log('----->', Object.keys(sideBarConf.docs));
  const sections = Object.keys(sideBarConf.docs);
  const titles = idTitleMap[lng];

  return (
    <List
      component="nav"
      aria-labelledby="Documentation"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }>
      {sections.map((section) => (
        <>
          <ListItem button key={section}>
            <ListItemText primary={section} />
          </ListItem>
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {sideBarConf.docs[section].map((item) => {
                if (typeof item !== 'string') {
                  return null;
                }

                return (
                  <ListItem button>
                    <Link to={`/docs/${lng}/${item}.html`}>
                      <ListItemText
                        primary={titles[item]}
                        key={titles[item]}
                        css={(theme) => ({
                          paddingLeft: theme.spacing(4),
                        })}
                      />
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </>
      ))}
    </List>
  );
};

export default SideBar;
