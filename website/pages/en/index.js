const React = require('react');

const CompLibrary = require('docusaurus/lib/core/CompLibrary.js');
const translate = require("docusaurus/lib/server/translate.js").translate;
const translation = require('docusaurus/lib/server/translation.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

const createShowcase = (userList) => {
  return userList
    .filter((user) => {
      if (user.pinned) {
        return user;
      }
    })
    .map((user, i) => {
    return (
      <a href={user.infoLink} key={i} target="_blank" class="userLink" data-caption={user.caption} rel="noopener/noreferrer">
        <img src={siteConfig.baseUrl + user.image} alt={user.caption} title={user.caption} />
      </a>
    );
  });
}

class TweetsSection extends React.Component {
  render() {
    let language = this.props.language || 'en';
    return(
      <div className="tweets-section">
        <div>
          {this.renderTweetUpRight(language)}
        </div>
        <div>
          {this.renderTweetUpLeft(language)}
        </div>
        <div>
          {this.renderTweetDownRight(language)}
        </div>
        <div>
          {this.renderTweetDownLeft(language)}
        </div>
        <div>
          {this.renderSnyk(language)}
        </div>
        <div>
          {this.renderMichael(language)}
        </div>
      </div>);
  }

  renderTweetUpRight(language) {
    return (<blockquote className="twitter-tweet" data-cards="hidden" data-lang={language}><p lang="en" dir="ltr">In a world
        where <a href="https://twitter.com/npmjs?ref_src=twsrc%5Etfw">@npmjs</a> and other core infrastructure fully
        embraced the &quot;move fast and break things&quot; mindset, it&#39;s great to see other people care deeply about
        stability. <a href="https://t.co/uVk7xFeiwU">https://t.co/uVk7xFeiwU</a> &quot;just works&quot; and has saved us
        countless headaches. Thanks <a href="https://twitter.com/verdaccio_npm?ref_src=twsrc%5Etfw">@verdaccio_npm</a> !
      </p>&mdash; Sheet JS (@SheetJS) <a
        href="https://twitter.com/SheetJS/status/1002609907370250241?ref_src=twsrc%5Etfw">1 de junio de 2018</a>
      </blockquote>);
  }

  renderTweetUpLeft(language) {
    return (
      <blockquote className="twitter-tweet" data-lang={language}><p lang="en" dir="ltr">Woke up to <a
        href="https://twitter.com/timer150?ref_src=twsrc%5Etfw">@timer150</a> fixing end-to-end test flakiness in Create
        React App 👏 Background: we have a Lerna monorepo and used very complex hacks for integration testing of
        generated projects. Solution: run a local npm registry to simulate a publish 😁 <a
          href="https://t.co/ggNfS4PpFv">https://t.co/ggNfS4PpFv</a></p>&mdash; Dan Abramov (@dan_abramov) <a
        href="https://twitter.com/dan_abramov/status/951427300070916096?ref_src=twsrc%5Etfw">11 de enero de 2018</a>
      </blockquote>);
  }

  renderTweetDownRight(language) {
    return (
      <blockquote className="twitter-tweet" data-lang={language}><p lang="en" dir="ltr">Verdaccio is my personal hero. A
        lightweight npm registry &amp; cache. Just two commands to install + use it. <a
          href="https://twitter.com/hashtag/incredibile?src=hash&amp;ref_src=twsrc%5Etfw">#incredibile</a> <a
          href="https://t.co/X0uNgS6UMz">https://t.co/X0uNgS6UMz</a></p>&mdash; Manfred Steyer (@ManfredSteyer) <a
        href="https://twitter.com/arcanis/status/1291333754372399105?ref_src=twsrc%5Etfw">31 de mayo de 2018</a>
      </blockquote>)
  }

  renderTweetDownLeft(language) {
    return (
      <blockquote className="twitter-tweet" data-conversation="none" data-cards="hidden" data-lang={language}>
        <p lang="en" dir="ltr">
          <a href="https://twitter.com/verdaccio_npm?ref_src=twsrc%5Etfw">@verdaccio_npm</a> is a pretty good open-source
        tool and seems to be growing. We&#39;re currently using them at NodeSource for some internal caching and
        modules, and are happy so far. Easy to setup for both business and use.<br/><br/>🔗
          <a href="https://t.co/ow5JRgZYrU">https://t.co/ow5JRgZYrU</a>
        </p>&mdash; Tierney Cyren (@bitandbang) <a
        href="https://twitter.com/bitandbang/status/1001297542779424768?ref_src=twsrc%5Etfw">29 de mayo de 2018</a>
      </blockquote>);
  }

  renderMichael(language) {
    return (
      <blockquote className="twitter-tweet" data-conversation="none" data-cards="hidden" data-lang={language}>
        <p lang="en" dir="ltr">I&#39;m increasingly relying on
          <a href="https://twitter.com/verdaccio_npm?ref_src=twsrc%5Etfw">@verdaccio_npm</a> to help test complex monorepo
            release scenarios. I&#39;ve already published about 20 versions today before I got the process exactly
            right.<br/><br/>This would simply not be feasible with other tools or approaches. Verdaccio is simple and 🔥
        </p>&mdash; Michael Bromley (@michlbrmly)
        <a href="https://twitter.com/michlbrmly/status/1169571193550192641?ref_src=twsrc%5Etfw">September 5, 2019</a>
      </blockquote>
      );
  }

  renderSnyk(language) {
    return (
      <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr">The 10 <a href="https://twitter.com/npmjs?ref_src=twsrc%5Etfw">@npmjs</a> security best practices with
          <a href="https://twitter.com/liran_tal?ref_src=twsrc%5Etfw">@liran_tal</a>
            and
          <a href="https://twitter.com/jotadeveloper?ref_src=twsrc%5Etfw">@jotadeveloper</a>: #6 Use a local npm proxy (with
          <a href="https://twitter.com/verdaccio_npm?ref_src=twsrc%5Etfw">@verdaccio_npm</a>)
          <a href="https://t.co/KDLN6nGHhM">https://t.co/KDLN6nGHhM</a>
          <a href="https://t.co/0RbGT4HdLb">pic.twitter.com/0RbGT4HdLb</a></p>&mdash; Snyk (@snyksec)
          <a href="https://twitter.com/snyksec/status/1168280372800557063?ref_src=twsrc%5Etfw">September 1, 2019
          </a>
        </blockquote>
      );
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
        <span id="getstarted">
          <Button href={this.buildUrl('/what-is-verdaccio.html')}>
            <translate>
              Get Started
            </translate>
          </Button>
        </span>
        <span id="goToGitHub">
          <Button href="https://github.com/verdaccio" target="_blank">
            Github
          </Button>
        </span>
        <span id="contribute">
          <Button href="/contributors">
            <translate>
              Contributors
            </translate>
          </Button>
        </span>
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
              <img title={siteConfig.title} alt={siteConfig.title} src={siteConfig.baseUrl + 'img/logo/banner/png/verdaccio-banner@2x.png'} />
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
              <div style={{marginTop: '8px'}}>
                <a class="twitter-follow-button"
                  href="https://twitter.com/verdaccio_npm"
                  data-size="default">
                  Follow @verdaccio_npm</a>
              </div>
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

const MiddleBanner = (props) => {
  return (
    <div className="conf" style={{textAlign: 'center'}}>
      {props.children}
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
            <img src={siteConfig.baseUrl + user.image} alt={user.caption} title={user.caption} />
          </a>
        );
      });

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container padding={['top']}>
            <div id="codeInstall">
              <FeatureSection/>
            </div>
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
                  'helm repo add verdaccio https://charts.verdaccio.org\n'+
                  'helm repo update\n'+
                  'helm install --name npm verdaccio/verdaccio\n' +
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
                  image: siteConfig.baseUrl + 'img/logo/symbol/png/verdaccio-tiny@3x.png',
                  imageAlign: 'right',
                  title: <translate>Plugin Support</translate>,
                },
              ]}
            />
          </Container>

          <div className="productShowcaseSection paddingBottom" id="users">
            <h2>
              <translate>
                Who's Using This?
              </translate>
            </h2>
            <div className="logos">{createShowcase(siteConfig.nonSponsorUsers)}</div>
            <div className="more-users">
              <a
                className="button"
                href={
                  siteConfig.baseUrl + this.props.language + '/' + 'users.html'
                }>
                <translate>More</translate> {siteConfig.title} <translate>Users</translate>
              </a>
              <br/>
              <br/>
              <div>
                <a href="https://stackshare.io/verdaccio" target="_blank">
                    <img src="https://camo.githubusercontent.com/133bad5d4856c564b2cb68e7c51ef10ff71b96a3/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f466f6c6c6f772532306f6e2d537461636b53686172652d626c75652e7376673f6c6f676f3d737461636b7368617265267374796c653d666c6174"
                      alt="stackshare" data-canonical-src="https://img.shields.io/badge/Follow%20on-StackShare-blue.svg?logo=stackshare&amp;style=flat"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
