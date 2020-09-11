import { graphql } from 'gatsby';
import React, { useState } from 'react';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import Layout from '../components/Layout';
import Header from '../components/Header';

import './docPage.css';
import SideBar from '../components/SideBar/SideBar';

const DocPage = (props: any) => {
  const { markdownRemark } = props.data;
  const title = markdownRemark.frontmatter.title;
  const html = markdownRemark.html;
  const [open, setOpen] = useState(true);
  console.log(props.pageContext);
  const { lng, sideBar, name, idTitleMap } = props.pageContext;

  const onClickOpen = () => {
    setOpen(!open);
  };

  return (
    <Layout>
      <h1>{title}</h1>
      <div>
        <Drawer
          variant="permanent"
          classes={{
            paper: 'jota',
          }}>
          <SideBar lng={lng} sideBarConf={sideBar} currentPage={name} idTitleMap={idTitleMap} />
        </Drawer>
        <main dangerouslySetInnerHTML={{ __html: html }} />
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
