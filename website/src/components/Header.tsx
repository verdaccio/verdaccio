import React, { FunctionComponent, MouseEventHandler } from 'react';
import { Link } from 'gatsby';
import cx from 'classnames';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import VerdaccioWhiteLogo from './VerdaccioWhiteLogo';

export type Props = {
  onClickOpen: MouseEventHandler;
  isPermanent: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      // zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#FFF',
    },
    appBarShift: {
      [theme.breakpoints.up('lg')]: {
        width: 'calc(100% - 299px)',
      },
    },
    drawer: {
      [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        width: 300,
      },
    },
    navIconHide: {
      color: '#000',
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
  })
);

const Header: FunctionComponent<Props> = ({ onClickOpen, isPermanent }) => {
  // const {
  //   site: {
  //     siteMetadata: { siteName },
  //   },
  // } = useStaticQuery(graphql`
  //   query {
  //     site {
  //       siteMetadata {
  //         siteName
  //       }
  //     }
  //   }
  // `);
  const classes = useStyles();

  return (
    <AppBar
      onClick={onClickOpen}
      className={cx(classes.appBar, {
        [classes.appBarShift]: isPermanent,
      })}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClickOpen} className={classes.navIconHide}>
          <MenuIcon />
        </IconButton>
        <Typography component="h2" variant="h5">
          <Link title="Home" to="/">
            <VerdaccioWhiteLogo width="30px" />
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
