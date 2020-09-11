import React, { FunctionComponent, MouseEventHandler } from 'react';
import { Link } from 'gatsby';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import VerdaccioWhiteLogo from './VerdaccioWhiteLogo';

export type Props = {
  onClickOpen: MouseEventHandler;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#FFF',
    },
  })
);

const Header: FunctionComponent<Props> = ({ onClickOpen }) => {
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
    <AppBar position="fixed" onClick={onClickOpen} className={classes.appBar}>
      <Toolbar>
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
