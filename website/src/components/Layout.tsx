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
};

const Layout: FunctionComponent<Props> = ({ children, classes }) => {
  const layoutClasses = useStyles();
  const { isDrawerOpen, setIsDrawerOpen } = usePageContext();

  const clickOpenMenuHandler = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  const clickOnOpenDrawerHandler = useCallback(() => {
    // no defined yet
  }, [isDrawerOpen]);

  const clickOnCloseDrawerHandler = useCallback(() => {
    // no defined yet
  }, [isDrawerOpen]);

  return (
    <div className={layoutClasses.root}>
      <CssBaseline />
      <Header onClickOpen={clickOpenMenuHandler} />
      <AppDrawer
        className={'paper'}
        isPermanent
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
