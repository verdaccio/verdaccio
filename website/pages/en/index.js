/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const translate = require("../../server/translate.js").translate;
const translation = require('../../server/translation.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="inner">
              <h2 className="projectTitle">
              <img title={siteConfig.title} src={siteConfig.baseUrl + 'img/verdaccio@2x.png'} />
                <small>
                  {
                    translation[this.props.language]['localized-strings']
                      .tagline
                  }
                </small>
              </h2>
              <div className="section promoSection">
                <div className="promoRow">
                  <div className="pluginRowBlock">
                    <Button
                      href={
                        siteConfig.baseUrl +
                        'docs/' +
                        this.props.language +
                        '/what-is-verdaccio.html'
                      }>
                      <translate>
                        Get Started
                      </translate>
                    </Button>
                    <Button href="https://github.com/verdaccio">Github</Button>
                    <Button
                      href={
                        siteConfig.baseUrl +
                        'docs/' +
                        this.props.language +
                        '/contributing.html'
                      }>
                      <translate>
                        Contribute
                      </translate>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="githubButton" style={{minHeight: '20px'}}>
                <a
                  className="github-button"
                  href={siteConfig.repoUrl}
                  data-icon="octicon-star"
                  data-count-href="/verdaccio/verdaccio/stargazers"
                  data-show-count={true}
                  data-count-aria-label="# stargazers on GitHub"
                  aria-label="Star verdaccio/verdaccio on GitHub"
                >
                  Star
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Index extends React.Component {
  render() {
    let language = this.props.language || 'en';
    const showcase = siteConfig.users
      .filter(user => {
        return user.pinned;
      })
      .map(user => {
        return (
          <a href={user.infoLink}>
            <img src={user.image} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container padding={['bottom', 'top']}>
            <GridBlock
              align="center"
              contents={[
                {
                  content: '```bash\n' +
                  '$> npm install --global verdaccio \n' +
                  '$> yarn global add verdaccio\n' +
                  '```',
                  title: <translate>Easy to Install</translate>,
                },
                {
                  content: '```bash\n' +
                  '$> npm set registry http://localhost:4873 \n' +
                  '$> npm adduser --registry http://localhost:4873\n' +
                  '```',
                  title: <translate>Easy to Set Up</translate>,
                }
              ]}
              layout="fourColumn"
            />
          </Container>

          <div
            className="productShowcaseSection paddingBottom"
            style={{textAlign: 'center'}}>
            <h2>
              <translate>
                Easy to Use
              </translate>
            </h2>
            <MarkdownBlock>
              ```bash&#8232;
                $> verdaccio &#8232;
                warn --- config file  - /home/.config/verdaccio/config.yaml &#8232;
                warn --- http address - http://localhost:4873/ - verdaccio/3.0.0&#8232;
              ```
            </MarkdownBlock>
            <h2>
              <translate>
                That’s it ! Enjoy your private package manager.
              </translate>
            </h2>
          </div>

          <Container padding={['bottom', 'top']} background="light">
            <GridBlock
              contents={[
                {
                  content: <translate>**npm**, **yarn** and **pnpm** are part of any development workflow
                    we try to catch up with the latest updates.</translate>,
                  image: siteConfig.baseUrl + 'img/package_managers_grey.png',
                  imageAlign: 'right',
                  title: <translate>The most popular npm clients are supported</translate>,
                },
              ]}
            />
          </Container>

          <Container padding={['bottom', 'top']} id="try">
            <GridBlock
              contents={[
                {
                  content: <translate>We have an official **Docker** image ready to use</translate> + '&#8232;\n' +
                  '```bash\n' +
                  'docker pull verdaccio/verdaccio\n' +
                  '```' +
                  '\n' +  <translate>and **Kubernetes Helm** support for easy deployment</translate> + '\n '+
                  '```bash\n' +
                  'helm install --name npm stable/verdaccio\n' +
                  '```\n',
                  image: siteConfig.baseUrl + 'img/devops_support_grey.png',
                  imageAlign: 'left',
                  title: <translate>Making the DevOps work easy</translate>,
                },
              ]}
            />
          </Container>

          <Container padding={['bottom', 'top']} background="dark">
            <GridBlock
              contents={[
                {
                  content:
                    <translate>Verdaccio is plugin based, authentication, middleware and storage support. Just pick one or create your custom one.</translate>,
                  image: siteConfig.baseUrl + 'img/verdaccio-tiny@3x.png',
                  imageAlign: 'right',
                  title: <translate>Plugin Support</translate>,
                },
              ]}
            />
          </Container>

          <div className="productShowcaseSection paddingBottom">
            <h2>
              <translate>
                Who's Using This?
              </translate>
            </h2>
            <p>
              <translate>
                This project is used by all these people
              </translate>
            </p>
            <div className="logos">{showcase}</div>
            <div className="more-users">
              <a
                className="button"
                href={
                  siteConfig.baseUrl + this.props.language + '/' + 'users.html'
                }>
                <translate>More</translate> {siteConfig.title} <translate>Users</translate>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
