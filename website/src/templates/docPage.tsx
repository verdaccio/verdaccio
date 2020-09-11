import { graphql } from 'gatsby';
import React, { useState } from 'react';
import clsx from 'clsx';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import SideBar from '../components/SideBar/SideBar';
import './docPage.css';

const drawerWidth = 350;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      paddingTop: theme.spacing(8),
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      paddingTop: 80 + 16,
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
      },
    },
  })
);

const DocPage = (props: any) => {
  const classes = useStyles();
  const { markdownRemark } = props.data;
  const title = markdownRemark.frontmatter.title;
  const html = markdownRemark.html;
  const { lng, sideBar, name, idTitleMap, markDownId } = props.pageContext;
  console.log(idTitleMap[lng]);
  return (
    <Layout>
      <h1>{title}</h1>
      <div className={classes.container}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}>
          <SideBar lng={lng} sideBarConf={sideBar} currentPage={name} idTitleMap={idTitleMap} />
        </Drawer>
        <main className={classes.content}>
          <Typography component="h4" variant="h5" color="textPrimary" gutterBottom>
            {idTitleMap[lng][markDownId]}
          </Typography>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: html }}></Typography>
        </main>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      fileAbsolutePath
      html
      frontmatter {
        title
      }
    }
  }
`;

export default DocPage;
