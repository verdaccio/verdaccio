import React, { FunctionComponent, useCallback } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import '../css/code.css';

import CssBaseline from '@material-ui/core/CssBaseline';

import Footer from './Footer';
import Header from './Header';
import { AppDrawer } from './AppDrawer/AppDrawer';
import { usePageContext } from './PageContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      fontSize: '18px',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    main: {
      width: '100%',
    },
  })
);

export type Props = {
  classes: any;
  isPermanent: boolean;
};

const Layout: FunctionComponent<Props> = ({ children, classes, isPermanent = true }) => {
  const layoutClasses = useStyles();
  const { isDrawerOpen, setIsDrawerOpen } = usePageContext();

  const clickOpenMenuHandler = useCallback(() => {
    setIsDrawerOpen(true);
  }, [isDrawerOpen]);

  const clickOnOpenDrawerHandler = useCallback(() => {
    // no defined yet
  }, [isDrawerOpen]);

  const clickOnCloseDrawerHandler = useCallback(() => {
    // no defined yet
    setIsDrawerOpen(false);
  }, [isDrawerOpen]);

  return (
    <div className={layoutClasses.root}>
      <CssBaseline />
      <Header onClickOpen={clickOpenMenuHandler} isPermanent={isPermanent} />
      <AppDrawer
        className={'paper'}
        isPermanent={isPermanent}
        open={isDrawerOpen}
        onClose={clickOnCloseDrawerHandler}
        classes={classes}
        onOpen={clickOnOpenDrawerHandler}
      />
      <Container component="main" className={layoutClasses.main}>
        {children}
        <Footer />
      </Container>
    </div>
  );
};

export default Layout;
