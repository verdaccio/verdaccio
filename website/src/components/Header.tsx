/** @jsx jsx */
import { Link } from 'gatsby';
import { jsx } from '@emotion/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import VerdaccioWhiteLogo from './VerdaccioWhiteLogo';

const Header = () => {
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
      css={() => ({
        backgroundColor: '#FFF',
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
