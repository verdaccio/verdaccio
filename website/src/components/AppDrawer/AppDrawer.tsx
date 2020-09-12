import React, { useState, FunctionComponent } from 'react';

import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import SideBar from '../SideBar/SideBar';
import { usePageContext } from '../PageContext';

export type Props = {
  className: string;
  isPermanent: boolean;
  open: boolean;
  onClose: any;
  classes: any;
  onOpen: any;
};

const DrawerSideBar = () => {
  const { currentPage, idTitleMap, language, sideBarConfiguration } = usePageContext();

  return (
    <SideBar lng={language} sideBarConf={sideBarConfiguration} currentPage={currentPage} idTitleMap={idTitleMap} />
  );
};

const AppDrawer: FunctionComponent<Props> = ({ className, isPermanent, onClose, onOpen, open, classes }) => {
  return (
    <nav className={className}>
      <Hidden lgUp={isPermanent} implementation="js">
        <SwipeableDrawer
          variant="temporary"
          onClose={onClose}
          onOpen={onOpen}
          open={open}
          ModalProps={{
            keepMounted: true,
          }}>
          {DrawerSideBar}
        </SwipeableDrawer>
      </Hidden>
      {isPermanent ? null : (
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.paper,
            }}
            variant="permanent"
            open>
            {DrawerSideBar}
          </Drawer>
        </Hidden>
      )}
    </nav>
  );
};

export { AppDrawer };
