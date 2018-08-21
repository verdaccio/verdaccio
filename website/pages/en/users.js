const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const translate = require("../../server/translate.js").translate;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Users extends React.Component {
  render() {
    const showcase = siteConfig.users.map((user, i) => {
      return (
        <a href={user.infoLink} key={i} target="_blank" rel="noopener">
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      );
    });

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
              <p>
                <translate>
                  This project is used by many folks
                </translate>
              </p>
            </div>
            <div className="logos">{showcase}</div>
            <p>
              <translate>
                Are you using this project? Do not be shy and add your company/project logo.
              </translate>
            </p>
            <a
              href="https://github.com/verdaccio/verdaccio/edit/master/website/siteConfig.js"
              className="button">
              <translate>
                Add your company
              </translate>
            </a>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Users;
