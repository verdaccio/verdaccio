import { graphql } from 'gatsby';
import React from 'react';

import Layout from '../components/Layout';

const Template = (props: any) => {
  const { markdownRemark } = props.data;
  const title = markdownRemark.frontmatter.title;
  const html = markdownRemark.html;

  return (
    <Layout>
      <h1>{title}</h1>
      <div className="blogpost" dangerouslySetInnerHTML={{ __html: html }} />
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

export default Template;
