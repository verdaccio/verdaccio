/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
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

                <small>{siteConfig.tagline}</small>
              </h2>
              <div className="section promoSection">
                <div className="promoRow">
                  <div className="pluginRowBlock">
                    <Button href="https://github.com/verdaccio">Github</Button>
                    <Button
                      href={
                        siteConfig.baseUrl +
                        'docs/' +
                        this.props.language +
                        '/installation.html'
                      }>
                      Documentation
                    </Button>
                    <Button
                      href={
                        siteConfig.baseUrl +
                        'docs/' +
                        this.props.language +
                        '/contributing.html'
                      }>
                      Contribute
                    </Button>
                  </div>
                </div>
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
                  title: 'Easy to Install',
                },
                {
                  content: '```bash\n' +
                  '$> npm set registry http://localhost:4873 \n' +
                  '$> npm adduser --registry http://localhost:4873\n' +
                  '```',
                  title: 'Easy to Set Up',
                }
              ]}
              layout="fourColumn"
            />
          </Container>

          <div
            className="productShowcaseSection paddingBottom"
            style={{textAlign: 'center'}}>
            <h2>Easy to Use</h2>
            <MarkdownBlock>
              ```bash&#8232;
                $> verdaccio &#8232;
                warn --- config file  - /home/.config/verdaccio/config.yaml &#8232;
                warn --- http address - http://localhost:4873/ - verdaccio/3.0.0&#8232;
              ```
            </MarkdownBlock>
            <h2>
              That’s it ! Enjoy your private package manager.
            </h2>
          </div>

          <Container padding={['bottom', 'top']} background="light">
            <GridBlock
              contents={[
                {
                  content: '**npm** and **yarn** are part of any development workflow,' +
                  ' we try to catch up with the latest updates.',
                  image: siteConfig.baseUrl + 'img/verdaccio-tiny@3x.png',
                  imageAlign: 'right',
                  title: 'The most popular npm clients are supported',
                },
              ]}
            />
          </Container>

          <Container padding={['bottom', 'top']} id="try">
            <GridBlock
              contents={[
                {
                  content: 'We have an official **Docker** image ready to use &#8232;\n' +
                  '```bash\n' +
                  'docker pull verdaccio/verdaccio&#8232;\n' +
                  '```' +
                  '\n and **Kubernetes Helm** support for easy deployment \n '+
                  '```bash\n' +
                  'helm install --name npm stable/verdaccio\n' +
                  '```\n',
                  image: siteConfig.baseUrl + 'img/verdaccio-tiny@3x.png',
                  imageAlign: 'left',
                  title: 'Making the DevOps work easy',
                },
              ]}
            />
          </Container>

          <Container padding={['bottom', 'top']} background="dark">
            <GridBlock
              contents={[
                {
                  content:
                    'Verdaccio is plugin based, authentication, middleware and storage support. ' +
                    'Just pick one or create your custom one.',
                  image: siteConfig.baseUrl + 'img/verdaccio-tiny@3x.png',
                  imageAlign: 'right',
                  title: 'Plugin Support',
                },
              ]}
            />
          </Container>

          <div className="productShowcaseSection paddingBottom">
            <h2>{"Who's Using This?"}</h2>
            <p>This project is used by all these people</p>
            <div className="logos">{showcase}</div>
            <div className="more-users">
              <a
                className="button"
                href={
                  siteConfig.baseUrl + this.props.language + '/' + 'users.html'
                }>
                More {siteConfig.title} Users
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
