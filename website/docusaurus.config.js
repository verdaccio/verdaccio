// @ts-check

const translations = require('@verdaccio/crowdin-translations/build/progress_lang.json');

const lgnMapping = {
  'de-DE': 'de',
  'pl-PL': 'pl',
  'cs-CZ': 'cs',
  'ga-IE': 'ga',
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
const isDeployPreview = process.env.CONTEXT === 'deploy-preview';
const isProductionDeployment = process.env.CONTEXT === 'production';
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

    if (translations[_lgn].approvalProgress <= limitLngIncluded) {
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

const i18nConfig = {
  defaultLocale: 'en',
  locales: isDeployPreview
    ? ['en']
    : filterByProgress([
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
      ]),
  localeConfigs: {
    en: { label: 'English' },
    'it-IT': { label: `Italiano (${progress['it'].translationProgress}%)` },
    'es-ES': { label: `Español (${progress['es-ES'].translationProgress}%)` },
    'de-DE': { label: `Deutsch (${progress['de'].translationProgress}%)` },
    'ga-IE': { label: `Gaeilge (Éire) (${progress['ga'].translationProgress}%)` },
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
  favicon: 'img/logo/uk/verdaccio-tiny-uk-no-bg.svg',
  i18n: i18nConfig,
  scripts: ['https://buttons.github.io/buttons.js'],
  plugins: [
    'docusaurus-plugin-sass',
    'docusaurus-plugin-contributors',
    isProductionDeployment &&
      typeof process.env.SENTRY_KEY === 'string' && [
        'docusaurus-plugin-sentry',
        { DSN: process.env.SENTRY_KEY },
      ],
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/node-api/src/index.ts'],
        tsconfig: '../packages/node-api/tsconfig.build.json',
        id: 'api/node-api',
        out: 'api/node-api',
        // theme: 'default',
        excludePrivate: false,
        excludeProtected: true,
        categorizeByGroup: false,
        excludeInternal: true,
        sidebar: {
          categoryLabel: '@verdaccio/node-api',
          // position: 1,
          fullNames: true,
        },
      },
    ],
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
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/config/src/index.ts'],
        tsconfig: '../packages/config/tsconfig.build.json',
        id: 'api/config',
        out: 'api/config',
        sidebar: {
          categoryLabel: '@verdaccio/config',
          fullNames: true,
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/ui-components/src/index.ts'],
        tsconfig: '../packages/ui-components/tsconfig.build.json',
        id: 'api/ui-components',
        out: 'api/ui-components',
        sidebar: {
          categoryLabel: '@verdaccio/ui-components',
          fullNames: true,
          watch: process.env.TYPEDOC_WATCH,
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/core/core/src/index.ts'],
        tsconfig: '../packages/core/core/tsconfig.build.json',
        id: 'api/core',
        out: 'api/core',
        sidebar: {
          categoryLabel: '@verdaccio/core',
          fullNames: true,
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/core/types/src/types.ts'],
        tsconfig: '../packages/core/types/tsconfig.build.json',
        id: 'api/types',
        out: 'api/types',
        categorizeByGroup: false,
        includeVersion: true,
        sidebar: {
          categoryLabel: '@verdaccio/types',
          fullNames: true,
        },
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        format: isServer ? 'cjs' : undefined,
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },
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
          label: 'Sponsor us',
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
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://fosstodon.org/@verdaccio',
          position: 'right',
          className: 'header-mastodon-link',
          'aria-label': 'Follow us at Fosstodon',
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
              html: `
              <a href="https://fosstodon.org/@verdaccio" rel="me">
                Mastodon
              </a>
              `,
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
              label: 'Mastodon',
              href: 'https://fosstodon.org/@verdaccio',
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
      copyright: `Copyright © ${new Date().getFullYear()} Verdaccio community. Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/nightOwl'),
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
          lastVersion: '5.x',
          // onlyIncludeVersions: ['next', '5.x', '6.x'],
          versions: {
            // current: {
            //   label: `next`,
            // },
            '6.x': {
              label: `6.x`,
              banner: 'unreleased',
            },
            '5.x': {
              label: `5.x`,
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
