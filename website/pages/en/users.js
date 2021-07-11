const React = require('react');
const CompLibrary = require('docusaurus/lib/core/CompLibrary.js');
const Container = CompLibrary.Container;
const translate = require("docusaurus/lib/server/translate.js").translate;

const siteConfig = require(process.cwd() + '/siteConfig.js');

const createShowcase = (userList) => {
  return userList.map((user, i) => {
    return (
      <a href={user.infoLink} key={i} target="_blank" rel="noopener">
        <img src={siteConfig.baseUrl + user.image} alt={user.caption} title={user.caption} />
      </a>
    );
  });
}
class Users extends React.Component {
  render() {

    return (
      <div className="mainContainer">
        <Container padding={['bottom', 'top']}>
          <div className="showcaseSection">
            <div className="prose">
              <h1>
                <translate>
                  Who's Using This?
                </translate>
              </h1>
              {siteConfig.sponsorUsers.length >= 1 && (<p>
                <translate>
                  Verdaccio is sponsored by these awesome folks...
                </translate>
              </p>)}
            </div>
            {siteConfig.sponsorUsers.length >= 1 && (
            <div className="logos">{createShowcase(siteConfig.sponsorUsers)}</div>)}
            {siteConfig.sponsorUsers.length >= 1 && (<div className="prose">
              <p>
                <translate>
                  and used by many others, including:
                </translate>
              </p>
            </div>)}
            <div className="logos">{createShowcase(siteConfig.nonSponsorUsers)}</div>
            <p>
              <translate>
                Are you using this project? Do not be shy and add your company/project logo.
              </translate>
            </p>
            <a
              href="https://github.com/verdaccio/website/edit/master/website/siteConfig.js"
              className="button">
              <translate>
                Add your project
              </translate>
            </a>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Users;
