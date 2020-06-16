/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { Link } from 'gatsby';

import SVGLogo from './SVGLogo';

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

  const searchIcon = css({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const searchStyle = css({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    marginLeft: 0,
    width: '100%',
  });

  return (
    <Container css={(theme: Theme) => ({ background: theme.palette.primary.main })}>
      <AppBar
        css={(theme: Theme) => ({
          padding: theme.spacing(1),
        })}
        elevation={1}
        position="sticky">
        <Toolbar>
          <Typography component="h1" variant="h5">
            <Link title="Home" to="/">
              <SVGLogo width="30px" />
            </Link>
          </Typography>
          <div css={searchStyle}>
            <div>
              <SearchIcon css={searchIcon} />
            </div>
            <InputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
          </div>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default Header;
