import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const Footer = () => {
  const {
    site: {
      siteMetadata: { siteName },
    },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteName
        }
      }
    }
  `);

  return (
    <Container component="footer">
      <Grid alignItems="center" container justify="space-around">
        <Grid item>
          <Typography variant="overline">{`© ${new Date().getFullYear()} ${siteName}, All rights reserved.`}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
