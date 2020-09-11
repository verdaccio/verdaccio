import { graphql } from 'gatsby';
import React, { useState } from 'react';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Layout from '../components/Layout';
import SideBar from '../components/SideBar/SideBar';

import './docPage.css';

const drawerWidth = 240;

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
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const DocPage = (props: any) => {
  const classes = useStyles();
  const { markdownRemark } = props.data;
  const title = markdownRemark.frontmatter.title;
  const html = markdownRemark.html;
  const [open, setOpen] = useState(true);
  const { lng, sideBar, name, idTitleMap } = props.pageContext;

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
        <main dangerouslySetInnerHTML={{ __html: html }} className={classes.content} />
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
