// @ts-check

const translations = require('@verdaccio/crowdin-translations/build/progress_lang.json');
// @ts-ignore
const progress = translations;
const isDeployPreview = process.env.CONTEXT === "deploy-preview";
const isProductionDeployment = process.env.CONTEXT === "production";

const i18nConfig = {
  defaultLocale: 'en',
  locales: isDeployPreview ? ['en'] : [
    "en",
    "cs-CZ",
    "de-DE",
    "es-ES",
     "fr-FR",
    "it-IT",
     "pl-PL",
    "pt-BR",
     "ru-RU",
    "sr-CS",
     "vi-VN",
    "yo-NG", 
    "zh-TW",
    "zh-CN"
  ],
  localeConfigs: {
    en: { label: "English" },
    'it-IT': { label: `Italiano (${progress["it"].translationProgress}%)` },
    'es-ES': { label: `Español (${progress["es-ES"].translationProgress}%)` },
    'de-DE': { label: `Deutsch (${progress["de"].translationProgress}%)` },
    'cs-CZ': { label: `Čeština (Česko) (${progress["cs"].translationProgress}%)` },
    'fr-FR': { label: `Français (${progress["fr"].translationProgress}%)` },
    'pl-PL': { label: `Polski (Polska) (${progress["pl"].translationProgress}%)` },
    'pt-BR': { label: `Português (Brasil) (${progress["pt-BR"].translationProgress}%)` },
    'ru-RU': { label: `Русский (Россия) (${progress["ru"].translationProgress}%)` },
    'zh-CN': { label: `中文（中国）(${progress["zh-CN"].translationProgress}%)` },
    'zh-TW': { label: `中文（台灣）(${progress["zh-TW"].translationProgress}%)` },
    'yo-NG': { label: `Èdè Yorùbá (Nàìjíríà) (${progress["yo"].translationProgress}%)` },
    'sr-CS': { label: `Српски (Србија) (${progress["sr-CS"].translationProgress}%)` },
    'vi-VN': { label: `Tiếng Việt (Việt Nam) (${progress["vi"].translationProgress}%)` },
  }
}

const pkgJson = require('./package.json')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Verdaccio',
  tagline: 'A lightweight Node.js private proxy registry',
  organizationName: 'verdaccio',
  projectName: 'verdaccio',
  url: 'https://verdaccio.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: "img/logo/uk/verdaccio-tiny-uk-no-bg.svg",
  i18n: i18nConfig,
  scripts: [
    "https://buttons.github.io/buttons.js",    
  ],
  plugins: [
    'docusaurus-plugin-sass',
    "docusaurus-plugin-contributors",
    isProductionDeployment && typeof process.env.SENTRY_KEY === 'string' && ['docusaurus-plugin-sentry', { DSN: process.env.SENTRY_KEY }],    
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/node-api/src/index.ts'],
        tsconfig: '../packages/node-api/tsconfig.build.json',
        id: 'api/node-api',
        out: 'api/node-api',
        theme: 'github-wiki',
        excludePrivate: true,
        excludeProtected: true,
        excludeInternal: true,
        sidebar: {
          categoryLabel: '@verdaccio/core',
          position: 1,
          fullNames: true
        },
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../packages/config/src/index.ts'],
        tsconfig: '../packages/config/tsconfig.build.json',
        id: 'api/config',
        out: 'api/config',
        theme: 'github-wiki',
        excludePrivate: true,
        excludeProtected: true,
        excludeInternal: true,
        sidebar: {
          categoryLabel: '@verdaccio/config',
          position: 2,
          fullNames: true
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
        theme: 'github-wiki',
        excludePrivate: false,
        excludeProtected: false,
        excludeInternal: false,
        sidebar: {
          categoryLabel: '@verdaccio/types',
          position: 3,
          fullNames: true
        },
      },
    ],
  ],
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
    description: 'A lightweight Node.js private proxy registry'
  },
  themeConfig: {
    announcementBar: {
      id: 'announcementBar',
      content:
        '<a target="_blank" rel="noopener noreferrer" href="https://www.wfp.org/support-us/stories/ukraine-appeal">Help provide humanitarian support to Ukraine refugees</a>!',
        isCloseable: false,
        backgroundColor: '#1595de',
        textColor: '#ffffff',
    },
    algolia: {
      appId: 'B3TG5CBF5H',
      apiKey: 'ed054733cb03418e9af25b7beb82c924',
      indexName: 'verdaccio',
      contextualSearch: true
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: `Verdaccio - v${pkgJson.version}`,
      logo: {
        alt: 'Verdaccio Logo',
        src: "img/logo/uk/verdaccio-tiny-uk-no-bg.svg",
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
          label: 'API'
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/help', label: 'Help', position: 'left' }, 
        {
          type: 'docsVersionDropdown',
          "position": "right",
        },       
        {
          href: 'https://opencollective.com/verdaccio',
          label: 'Sponsor us',
          position: 'right',
        },
        {
          href: 'https://www.youtube.com/channel/UC5i20v6o7lSjXzAHOvatt0w',
          label: 'YouTube',
          position: 'right',
        },
        {
          href: '/contributors',
          label: 'Contributors',
          position: 'right',
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
              label: 'Twitter',
              href: 'https://twitter.com/verdaccio_npm',
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
              label: 'Twitter',
              href: 'https://twitter.com/verdaccio_npm',
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
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
          editUrl: ({ locale, docPath }) => {
            if (locale !== 'en') {
              return `https://crowdin.com/project/verdaccio/${locale}`;
            }
            return `https://github.com/verdaccio/verdaccio/edit/master/website/docs/${docPath}`;
          },
          lastVersion : '5.x',
          versions: {
            current: {
              label: `6.x`, 
            },
            '5.x': {
              label: `5.x (Latest)`, 
            },
          },
        },
        googleAnalytics: {
          // trackingID: 'UA-2527438-21'
          trackingID: 'G-PCYM9FYJZT'
        },
        gtag: {
          trackingID: 'G-PCYM9FYJZT'
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
