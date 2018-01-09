/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [];

const siteConfig = {
  title: 'Verdaccio' /* title for your website */,
  tagline: 'A lightweight private npm proxy registry',
  url: 'http://www.verdaccio.org' /* your website url */,
  organizationName: 'verdaccio',
  baseUrl: '/verdaccio' /* base url for your project */,
  projectName: 'verdaccio',
  headerLinks: [
    {doc: 'installation', label: 'Docs'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/verdaccio-tiny.png',
  footerIcon: 'img/verdaccio-blackwhite.png',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#4B5E40',
    secondaryColor: '#205C3B',
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Verdaccio community',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/verdaccio/verdaccio',
};

module.exports = siteConfig;
