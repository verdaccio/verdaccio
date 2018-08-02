const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const translate = require("../../server/translate.js").translate;
const translation = require('../../server/translation.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class TweetsSection extends React.Component {
  render() {
    return(
      <div className="tweets-section">
        <div>
          {this.renderTweetUpRight()}
        </div>
        <div>
          {this.renderTweetUpLeft()}
        </div>
        <div>
          {this.renderTweetDownRight()}
        </div>
        <div>
          {this.renderTweetDownLeft()}
        </div>
      </div>);
  }

  renderTweetUpRight() {
    return (<blockquote className="twitter-tweet" data-cards="hidden" data-lang="es"><p lang="en" dir="ltr">In a world
        where <a href="https://twitter.com/npmjs?ref_src=twsrc%5Etfw">@npmjs</a> and other core infrastructure fully
        embraced the &quot;move fast and break things&quot; mindset, it&#39;s great to see other people care deeply about
        stability. <a href="https://t.co/uVk7xFeiwU">https://t.co/uVk7xFeiwU</a> &quot;just works&quot; and has saved us
        countless headaches. Thanks <a href="https://twitter.com/verdaccio_npm?ref_src=twsrc%5Etfw">@verdaccio_npm</a> !
      </p>&mdash; Sheet JS (@SheetJS) <a
        href="https://twitter.com/SheetJS/status/1002609907370250241?ref_src=twsrc%5Etfw">1 de junio de 2018</a>
      </blockquote>);
  }

  renderTweetUpLeft() {
    return (
      <blockquote className="twitter-tweet" data-lang="es"><p lang="en" dir="ltr">Woke up to <a
        href="https://twitter.com/timer150?ref_src=twsrc%5Etfw">@timer150</a> fixing end-to-end test flakiness in Create
        React App 👏 Background: we have a Lerna monorepo and used very complex hacks for integration testing of
        generated projects. Solution: run a local npm registry to simulate a publish 😁 <a
          href="https://t.co/ggNfS4PpFv">https://t.co/ggNfS4PpFv</a></p>&mdash; Dan Abramov (@dan_abramov) <a
        href="https://twitter.com/dan_abramov/status/951427300070916096?ref_src=twsrc%5Etfw">11 de enero de 2018</a>
      </blockquote>);
  }

  renderTweetDownRight() {
    return (
      <blockquote className="twitter-tweet" data-lang="es"><p lang="en" dir="ltr">Verdaccio is my personal hero. A
        lightweight npm registry &amp; cache. Just two commands to install + use it. <a
          href="https://twitter.com/hashtag/incredibile?src=hash&amp;ref_src=twsrc%5Etfw">#incredibile</a> <a
          href="https://t.co/X0uNgS6UMz">https://t.co/X0uNgS6UMz</a></p>&mdash; Manfred Steyer (@ManfredSteyer) <a
        href="https://twitter.com/ManfredSteyer/status/1002153128140136448?ref_src=twsrc%5Etfw">31 de mayo de 2018</a>
      </blockquote>)
  }

  renderTweetDownLeft() {
    return (
      <blockquote className="twitter-tweet" data-conversation="none" data-cards="hidden" data-lang="es">
        <p lang="en" dir="ltr">
          <a href="https://twitter.com/verdaccio_npm?ref_src=twsrc%5Etfw">@verdaccio_npm</a> is a pretty good open-source
        tool and seems to be growing. We&#39;re currently using them at NodeSource for some internal caching and
        modules, and are happy so far. Easy to setup for both business and use.<br/><br/>🔗
          <a href="https://t.co/ow5JRgZYrU">https://t.co/ow5JRgZYrU</a>
        </p>&mdash; Tierney Cyren (@bitandbang) <a
        href="https://twitter.com/bitandbang/status/1001297542779424768?ref_src=twsrc%5Etfw">29 de mayo de 2018</a>
      </blockquote>);
  }
}

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

class HeaderButtons extends React.Component {
  buildUrl(relativePath) {
    return `${siteConfig.baseUrl}docs/${this.props.language}${relativePath}`;
  }

  render() {
    return (
      <div className="pluginRowBlock">
        <Button href={this.buildUrl('/what-is-verdaccio.html')}>
          <translate>
            Get Started
          </translate>
        </Button>
        <Button href="https://github.com/verdaccio">
          Github
        </Button>
        <Button href={this.buildUrl('/contributing.html')}>
          <translate>
            Contribute
          </translate>
        </Button>
      </div>
    )
  }
}

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="inner">
              <h1 className="projectTitle">
              <img title={siteConfig.title} alt={siteConfig.title} src={siteConfig.baseUrl + 'img/verdaccio@2x.png'} />
                <small>
                  {
                    translation[this.props.language]['localized-strings'].tagline
                  }
                </small>
              </h1>
              <div className="section promoSection">
                <div className="promoRow">
                  <HeaderButtons language={this.props.language}/>
                </div>
              </div>
              <iframe
                src={"https://ghbtns.com/github-btn.html?user=verdaccio&repo=verdaccio&type=star&count=true&size=large"}
                frameBorder="0"
                scrolling="0"
                width="160px"
                height="30px"
                style={{marginTop: '8px'}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const FeatureSection = () => (
  <GridBlock
    className="feature-section"
    align="center"
    contents={[
      {
        content: '```bash\n' + 'npm install --global verdaccio'
      }
    ]}
    layout="twoColumn"
  />
);

const MiddleTitle = (props) => {
  return (
    <div className="productShowcaseSection paddingBottom"
         style={{textAlign: 'center'}}>
      <h2>
        {props.children}
      </h2>
    </div>
  );
}



class Index extends React.Component {
  render() {
    let language = this.props.language || 'en';
    const showcase = siteConfig.users
      .filter(user => {
        return user.pinned;
      })
      .map((user, i) => {
        return (
          <a href={user.infoLink} key={i} target="_blank" rel="noopener">
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container padding={['top']}>
            <FeatureSection/>
          </Container>
          <MiddleTitle>
              <translate>
                That’s it ! Enjoy your private package manager.
              </translate>
          </MiddleTitle>
          <Container>
            <TweetsSection/>
          </Container>
          <MiddleTitle>
            <translate>
              Many great developers are already enjoying Verdaccio, join the community!
            </translate>
          </MiddleTitle>
          <Container padding={['bottom', 'top']} background="light">
            <GridBlock
              contents={[
                {
                  content: <translate>**npm**, **yarn** and **pnpm** are part of any development workflow
                    we try to catch up with the latest updates.</translate>,
                  image: siteConfig.baseUrl + 'img/package_managers_grey.png',
                  imageAlt: 'The most popular npm clients are supported',
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
