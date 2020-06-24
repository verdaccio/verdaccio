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

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const docPageTemplate = path.resolve('src/templates/docPage.tsx');
    resolve(
      graphql(
        `
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
        `
      ).then((result) => {
        const posts = result.data.allMarkdownRemark.edges;
        posts.forEach(({ node }, index) => {
          const fileAbsolutePath = node.fileAbsolutePath;
          const parsedAbsolutedPath = path.parse(fileAbsolutePath);
          if (fileAbsolutePath.match('translated_docs')) {
            const pathCrowdin = `${__dirname}/crowdin/master/website/translated_docs/`;
            const lng = parsedAbsolutedPath.dir.replace(pathCrowdin, '');
            const id = node.id;
            createPage({
              path: `docs/${lng}/${parsedAbsolutedPath.name}.html`,
              component: docPageTemplate,
              context: {
                id,
                lng,
              },
            });
          } else {
            const id = node.id;
            const lng = 'en';
            createPage({
              path: `docs/en/${parsedAbsolutedPath.name}.html`,
              component: docPageTemplate,
              context: {
                id,
                lng,
              },
            });
          }
          resolve();
        });
      })
    );
  });
};
