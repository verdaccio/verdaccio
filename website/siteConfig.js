
const {loadYaml} = require('./utils');

const team = loadYaml("./data/team.yml");
const users = [
  {
    caption: "Filiosoft",
    image: "/img/users/filiosoft.png",
    infoLink: "https://filiosoft.com/",
    fbOpenSource: false,
    pinned: false,
  },
  {
    caption: "SheetJS",
    image: "/img/users/sheetjs.png",
    infoLink: "https://sheetjs.com/",
    fbOpenSource: false,
    pinned: true,
  },
  {
    caption: "Mozilla Neutrino",
    image: "/img/users/neutrino.png",
    infoLink: "https://neutrinojs.org/",
    fbOpenSource: false,
    pinned: true,
  },
  {
    caption: "pnpm",
    image: "/img/users/pnpm.svg",
    infoLink: "https://pnpm.js.org/",
    fbOpenSource: false,
    pinned: true,
  },
  {
    caption: "nodesource",
    image: "/img/users/nodesource.jpg",
    infoLink: "https://nodesource.com/",
    fbOpenSource: false,
    pinned: true,
  },
  {
    caption: "Strapi",
    image: "/img/users/strapijs.jpg",
    infoLink: "https://strapi.io/",
    fbOpenSource: false,
    pinned: true,
  },
  {
    caption: "Innovaccer",
    image: "/img/users/innovaccer.png",
    infoLink: "http://innovaccer.com/",
    fbOpenSource: false,
    pinned: true,
  },
];

const siteConfig = {
  title: 'Verdaccio' /* title for your website */,
  tagline: 'Verdaccio · A lightweight private npm proxy registry',
  url: 'https://verdaccio.org' /* your website url */,
  organizationName: 'verdaccio',
  cname: 'verdaccio.org',
  noIndex: false,
  baseUrl: '/' /* base url for your project */,
  projectName: 'verdaccio',
  headerLinks: [
    { doc: 'installation', label: 'Docs'},
    { href: "https://medium.com/verdaccio", label: 'Blog'},
    { page: 'help', label: 'Help'},
    { href: "https://github.com/verdaccio", label: "GitHub" },
    { search: true },
    { page: 'team', label: 'Team'},
    { href: "https://opencollective.com/verdaccio", label: "Donate" },
  ],
  users,
  team,
  headerIcon: 'img/logo/symbol/svg/verdaccio-tiny.svg',
  footerIcon: 'img/logo/symbol/svg/verdaccio-blackwhite.svg',
  favicon: 'img/favicon/favicon.ico',
  colors: {
    primaryColor: '#4B5E40',
    secondaryColor: '#205C3B',
  },
  translationRecruitingLink: 'https://crowdin.com/project/verdaccio',
  copyright:
    'Copyright © ' + new Date().getFullYear() + ' Verdaccio community',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  usePrism: ['jsx'],
  highlight: {
    theme: 'atom-one-dark',
  },
  algolia: {
    apiKey: 'a8b4d117e513cd8d71d6a95e3d9d4a91',
    indexName: 'verdaccio'
  },
  gaTrackingId: 'UA-2527438-21',
  twitter: true,
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-blocks-buttons.js',
  ],
  stylesheets: [
      '/css/code-blocks-buttons.css',
  ],
  repoUrl: 'https://github.com/verdaccio/verdaccio',
  cleanUrl: true,
  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },
};

module.exports = siteConfig;
