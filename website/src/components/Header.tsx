/** @jsx jsx */
import { Link } from 'gatsby';
import { jsx, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import VerdaccioWhiteLogo from './VerdaccioWhiteLogo';
import {Theme} from "@material-ui/core";

const Header = () => {
  const theme: any = useTheme();
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
      elevation={1}
      position="static"
      color="primary"
      css={(theme: Theme) => ({
        backgroundColor: theme.palette.primary.main,
      })}>
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
