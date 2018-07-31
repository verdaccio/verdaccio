/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            <img
              src={this.props.config.baseUrl + this.props.config.footerIcon}
              alt={this.props.config.title}
              width="66"
              height="58"
            />
          </a>
          <div>
            <h5>Docs</h5>
            <a
              href={
                this.props.config.baseUrl +
                'docs/' +
                this.props.language +
                '/what-is-verdaccio.html'
              }>
              Getting Started
            </a>
            <a
              href={
                this.props.config.baseUrl +
                'docs/' +
                this.props.language +
                '/docker.html'
              }>
              Docker
            </a>
            <a
              href={
                this.props.config.baseUrl +
                'docs/' +
                this.props.language +
                '/configuration.html'
              }>
              Configuration
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href={
                this.props.config.baseUrl + this.props.language + '/users.html'
              }>
              User Showcase
            </a>
            <a
              href="https://stackoverflow.com/search?q=verdaccio" target="_blank">
              Stack Overflow
            </a>
            <a href="http://chat.verdaccio.org" target="_blank">Project Chat</a>
            <a href="https://twitter.com/verdaccio_npm" target="_blank">
              <img
                alt="Follow Verdaccio on Twitter"
                src="https://img.shields.io/twitter/follow/verdaccio_npm.svg?label=Follow+Verdaccio&style=social"
              />
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://medium.com/verdaccio" target="_blank">Blog</a>
            <a href="https://github.com/verdaccio" target="_blank">GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/verdaccio/verdaccio/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
