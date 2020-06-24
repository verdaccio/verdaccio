/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { FC, Fragment } from 'react';

import Footer from './Footer';
import Header from './Header';

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const Layout: FC = ({ children }) => (
  <Fragment>
    <CssBaseline />
    <Global
      styles={{
        '#gatsby-focus-wrapper': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
      }}
    />
    <Header />
    <div css={containerStyle}>{children}</div>
    <Footer />
  </Fragment>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
