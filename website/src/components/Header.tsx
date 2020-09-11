/** @jsx jsx */

import React, { FunctionComponent, MouseEventHandler } from 'react';
import { Link } from 'gatsby';
import { jsx } from '@emotion/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import VerdaccioWhiteLogo from './VerdaccioWhiteLogo';

export type Props = {
  onClickOpen: MouseEventHandler;
};

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

  return (
    <AppBar
      position="relative"
      css={() => ({
        backgroundColor: '#FFF',
      })}
      onClick={onClickOpen}>
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
