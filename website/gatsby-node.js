/**
 * Fix: react-🔥-dom patch is not detected.
 * https://github.com/gatsbyjs/gatsby/issues/11934
 */
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage.startsWith('develop')) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
    });
  }
};

// You can delete this file if you're not using it
const path = require('path');
const docPageTemplate = path.resolve('src/templates/docPage.tsx');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
            }
            html
            fileAbsolutePath
          }
        }
      }
    }
  `);

  const posts = result.data.allMarkdownRemark.edges;

  posts.forEach(({ node }) => {
    const parsedPath = path.parse(node.fileAbsolutePath);
    const id = node.id;
    const name = parsedPath.name;
    const lng = parsedPath.dir.match('translated_docs') ? parsedPath.dir.split('/').pop() : 'en';

    createPage({
      path: `docs/${lng}/${name}.html`,
      component: docPageTemplate,
      context: { id, lng },
    });
  });
};
