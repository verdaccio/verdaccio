import React, { FC, Fragment } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const Layout: FC = ({ children }) => (
  <Fragment>
    <CssBaseline />
    <Header onClickOpen={() => {}} />
    <main>{children}</main>
    <Footer />
  </Fragment>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
