// @ts-check

const { translationsData } = require('@verdaccio/local-scripts');
const translations = translationsData;

const lgnMapping = {
  'de-DE': 'de',
  'pl-PL': 'pl',
  'cs-CZ': 'cs',
  'ga-IE': 'ga-IE',
  'fr-FR': 'fr',
  'it-IT': 'it',
  'ru-RU': 'ru',
  'vi-VN': 'vi',
  'yo-NG': 'yo',
};

// @ts-ignore
const progress = translations;
const limitLngIncluded = 80;
console.log('limit translation is on %s%', limitLngIncluded);

const { themes } = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

const filterByProgress = (items) => {
  const originLng = Object.keys(translations);
  return items.filter((lgn) => {
    if (lgn === 'en') {
      return true;
    }
    const _lgn = lgnMapping[lgn] ? lgnMapping[lgn] : lgn;
    if (!originLng.includes(_lgn)) {
      console.log(`language ${_lgn} excluded, does not exist in origin`);
      return false;
    }

    if (translations[_lgn].translationProgress <= limitLngIncluded) {
      console.log(
        'language %s is being excluded due does not met limit of translation, current: %s%',
        _lgn,
        translations[_lgn].approvalProgress
      );
      return false;
    }

    return true;
  });
};

const locales = filterByProgress([
  'en',
  'cs-CZ',
  'de-DE',
  'es-ES',
  'fr-FR',
  'it-IT',
  'ga-IE',
  'pl-PL',
  'pt-BR',
  'ru-RU',
  'sr-CS',
  'vi-VN',
  'yo-NG',
  'zh-TW',
  'zh-CN',
]);

console.log('locales', locales);

const i18nConfig = {
  defaultLocale: 'en',
  locales,
  localeConfigs: {
    en: { label: 'English' },
    'it-IT': { label: `Italiano (${progress['it'].translationProgress}%)` },
    'es-ES': { label: `Español (${progress['es-ES'].translationProgress}%)` },
    'de-DE': { label: `Deutsch (${progress['de'].translationProgress}%)` },
    // 'ga-IE': { label: `Gaeilge (Éire) (${progress['ga-IE'].translationProgress}%)` },
    'cs-CZ': { label: `Čeština (Česko) (${progress['cs'].translationProgress}%)` },
    'fr-FR': { label: `Français (${progress['fr'].translationProgress}%)` },
    'pl-PL': { label: `Polski (Polska) (${progress['pl'].translationProgress}%)` },
    'pt-BR': { label: `Português (Brasil) (${progress['pt-BR'].translationProgress}%)` },
    'ru-RU': { label: `Русский (Россия) (${progress['ru'].translationProgress}%)` },
    'zh-CN': { label: `中文（中国）(${progress['zh-CN'].translationProgress}%)` },
    'zh-TW': { label: `中文（台灣）(${progress['zh-TW'].translationProgress}%)` },
    'yo-NG': { label: `Èdè Yorùbá (Nàìjíríà) (${progress['yo'].translationProgress}%)` },
    'sr-CS': { label: `Српски (Србија) (${progress['sr-CS'].translationProgress}%)` },
    'vi-VN': { label: `Tiếng Việt (Việt Nam) (${progress['vi'].translationProgress}%)` },
  },
};

module.exports = {
  title: 'Verdaccio',
  tagline: 'A lightweight Node.js private proxy registry',
  organizationName: 'verdaccio',
  projectName: 'verdaccio',
  url: 'https://verdaccio.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  onBrokenAnchors: 'warn',
  favicon: 'img/logo/uk/verdaccio-tiny-uk-no-bg.svg',
  i18n: i18nConfig,
  scripts: ['https://buttons.github.io/buttons.js'],
  plugins: [
    'docusaurus-plugin-sass',
    'docusaurus-plugin-contributors',
    'docusaurus-plugin-downloads',
    [
      'content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: require.resolve('./sidebarsCommunity.js'),
        showLastUpdateTime: true,
      },
    ],
    [
      'content-docs',
      {
        id: 'dev',
        path: 'dev',
        routeBasePath: 'dev',
        sidebarPath: require.resolve('./sidebarsDev.js'),
        showLastUpdateTime: true,
      },
    ],
    [
      'content-docs',
      {
        id: 'talks',
        path: 'talks',
        routeBasePath: 'talks',
        sidebarPath: require.resolve('./sidebarsTalk.js'),
        showLastUpdateTime: true,
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  customFields: {
    description: 'A lightweight Node.js private proxy registry',
  },
  themeConfig: {
    mermaid: {
      theme: { light: 'neutral', dark: 'forest' },
    },
    announcementBar: {
      id: 'announcementBar',
      content:
        '<a target="_blank" rel="noopener noreferrer" href="https://u24.gov.ua">OFFICIAL FUNDRAISING PLATFORM OF UKRAINE</a>!',
      isCloseable: false,
      backgroundColor: '#1595de',
      textColor: '#ffffff',
    },
    algolia: {
      appId: 'B3TG5CBF5H',
      apiKey: 'ed054733cb03418e9af25b7beb82c924',
      indexName: 'verdaccio',
      contextualSearch: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: `Verdaccio`,
      logo: {
        alt: 'Verdaccio Logo',
        src: 'img/logo/uk/verdaccio-tiny-uk-no-bg.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'what-is-verdaccio',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'api/node-api/index',
          position: 'left',
          label: 'API',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://opencollective.com/verdaccio',
          label: 'Sponsor Us',
          position: 'right',
        },
        {
          href: '/community',
          label: 'Community',
          position: 'left',
        },
        {
          href: '/talks',
          label: 'Video Talks',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [
            {
              href: 'https://crowdin.com/project/verdaccio',
              label: 'Help Us Translate',
            },
          ],
        },
        {
          href: 'https://github.com/verdaccio/verdaccio',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
        },
        {
          href: 'https://bsky.app/profile/verdaccio.org',
          position: 'right',
          className: 'header-bluesky-link',
          'aria-label': 'Follow Us on Bluesky',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/what-is-verdaccio',
            },
            {
              label: 'Docker',
              to: '/docs/docker',
            },
            {
              label: 'Configuration',
              to: '/docs/configuration',
            },
            {
              label: 'Logos',
              to: '/docs/logo',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/verdaccio',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/7qWJxBf',
            },
            {
              label: 'Bluesky',
              href: 'https://bsky.app/profile/verdaccio.org',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/verdaccio/verdaccio',
            },
            {
              html: `
                <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
                </a>
              `,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Verdaccio Community. Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: lightTheme,
      darkTheme: darkTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarCollapsible: true,
          remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
          editUrl: ({ locale, docPath }) => {
            if (locale !== 'en') {
              return `https://crowdin.com/project/verdaccio/${locale}`;
            }
            return `https://github.com/verdaccio/verdaccio/edit/master/website/docs/${docPath}`;
          },
          lastVersion: '6.x',
          versions: {
            '6.x': {
              label: `6.x`,
            },
          },
        },
        googleAnalytics: {
          trackingID: 'G-PCYM9FYJZT',
        },
        gtag: {
          trackingID: 'G-PCYM9FYJZT',
        },
        blog: {
          blogTitle: 'Verdaccio Official Blog',
          blogDescription: 'The official Verdaccio Node.js proxy registry blog',
          showReadingTime: true,
          postsPerPage: 3,
          feedOptions: {
            type: 'all',
          },
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All our posts',
          authorsMapPath: 'authors.yml',
          editUrl: ({ locale, blogDirPath, blogPath }) => {
            if (locale !== 'en') {
              return `https://crowdin.com/project/verdaccio/${locale}`;
            }
            return `https://github.com/verdaccio/verdaccio/edit/master/website/${blogDirPath}/${blogPath}`;
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
