/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const translate = require("docusaurus/lib/server/translate.js").translate;
const CompLibrary = require('docusaurus/lib/core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          <translate>Learn more about Verdaccio using the [documentation on this site.](/docs/en/installation.html)</translate>,
        title: <translate>Browse Docs</translate>,
      },
      {
        content: <translate>You can follow and contact us on</translate> + ' [Twitter](https://twitter.com/verdaccio_npm).',
        title: 'Twitter',
      },
      {
        content: <translate>If the documentation is not enough help, you can try browsing into our</translate> +
          " [Question Database](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aquestion+) ",
        title: 'GitHub',
      },
      {
        content: "Browse questions at Stackoverflow also could be useful [Questions](https://stackoverflow.com/questions/tagged/verdaccio) ",
        title: 'Stackoverflow',
      },
      {
        content: <translate>and also you can chat with the Verdaccio community at</translate> + ' [Community Chat](http://chat.verdaccio.org).',
        title: 'Verdaccio Chat',
      },
      {
        content: 'If you have specific pnpm questions, join their community chat [Community Chat](https://discord.gg/PKwUpW).',
        title: 'pnpm Chat',
      },
      {
        content: 'If you have specific yarn questions, join their community chat [Community Chat](https://discord.gg/x9F2jJ).',
        title: 'Yarn Chat',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>
                <translate>
                  Need help?
                </translate>
              </h2>
            </header>
            <p>
              <translate>
                This project is maintained by the Verdaccio community.
              </translate>
            </p>
            <GridBlock contents={supportLinks} layout="fourColumn" />
          </div>
          <iframe src="https://discord.com/widget?id=388674437219745793&theme=dark" width="350" height="500"
                  allowTransparency="true" frameBorder="0"></iframe>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
