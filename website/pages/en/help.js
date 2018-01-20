/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          'Learn more about Verdaccio using the [documentation on this site.](/docs/en/installation.html)',
        title: 'Browse Docs',
      },
      {
        content: 'You can follow and contact us on [Twitter](https://twitter.com/verdaccio_npm).',
        title: 'Twitter',
      },
      {
        content: "If the documentation is not enough help, you can try browsing into our " +
        "[Question Database](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aquestion+) " +
        "and also you can chat with the Verdaccio community in [Gitter](https://gitter.im/verdaccio/).",
        title: 'More Help?',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>Need help?</h2>
            </header>
            <p>This project is maintained by the Verdaccio community.</p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
