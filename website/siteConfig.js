/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: "Filiosoft",
    image: "/img/filiosoft.png",
    infoLink: "https://filiosoft.com/",
    fbOpenSource: false,
    pinned: false,
  },
  {
    caption: "SheetJS",
    image: "/img/sheetjs.png",
    infoLink: "https://sheetjs.com/",
    fbOpenSource: false,
    pinned: true,
  }
];

const siteConfig = {
  title: 'Verdaccio' /* title for your website */,
  tagline: 'Verdaccio · A lightweight private npm proxy registry',
  url: 'http://www.verdaccio.org' /* your website url */,
  organizationName: 'verdaccio',
  cname: 'www.verdaccio.org',
  noIndex: false,
  baseUrl: '/' /* base url for your project */,
  projectName: 'verdaccio',
  headerLinks: [
    {doc: 'installation', label: 'Docs'},
    {page: 'help', label: 'Help'},
    { href: "https://medium.com/verdaccio", label: 'Blog'},
    { href: "https://github.com/verdaccio", label: "GitHub" }
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/verdaccio-tiny.png',
  footerIcon: 'img/verdaccio-blackwhite.png',
  favicon: 'img/favicon.ico',
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
  algolia: {
    apiKey: 'a8b4d117e513cd8d71d6a95e3d9d4a91',
    indexName: 'verdaccio',
  },
  gaTrackingId: 'UA-2527438-21',
  twitter: true,
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/verdaccio/verdaccio',
};

module.exports = siteConfig;
