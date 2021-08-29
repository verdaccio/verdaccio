// @ts-check

const isDeployPreview = process.env.CONTEXT === "deploy-preview";
const isProductionDeployment = process.env.CONTEXT === "production";

const localesWithLowRatioOfTranslation = ["ar-SA", "fil-PH", "gl-ES", "hi-IN", "ja-JP", "ko-KR", "pt-PT", "sr-SP", "tg-TJ", "ro-RO", "zh-CN"];
/** @type {import('@docusaurus/types').DocusaurusConfig['i18n']} */
const i18nConfig = {
  defaultLocale: 'en',
  locales: isDeployPreview ? ['en'] : [
    "en", "cs-CZ", "de-DE",
    "es-ES", "fr-FR",
    "it-IT", "pl-PL",
    "pt-BR", "ru-RU",
    "sr-CS", "vi-VN",
    "yo-NG", "zh-TW",
    "zh-CN"
  ],
  localeConfigs: {
    ar: {
      direction: 'rtl'
    }
  }
}

const pkgJson = require('./package.json')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Verdaccio',
  tagline: 'A lightweight open source private npm proxy registry',
  organizationName: 'verdaccio',
  projectName: 'verdaccio',
  url: 'https://verdaccio.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo/symbol/svg/verdaccio-tiny.svg',
  i18n: i18nConfig,
  plugins: [
    'docusaurus-plugin-sass',
    isProductionDeployment && ['docusaurus-plugin-sentry', { DSN: 'a7bc89ee3f284570b1d9a47e600e7597' }]
  ].filter(Boolean),
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
    description: 'A lightweight private NPM proxy registry built in Node.js.'
  },
  themeConfig: {
    announcementBar: {
      id: 'announcementBar',
      content:
        'If you like Verdaccio, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/verdaccio/verdaccio">GitHub</a>! ⭐',
    },
    algolia: {
      apiKey: 'a8b4d117e513cd8d71d6a95e3d9d4a91',
      indexName: 'verdaccio',
      contextualSearch: true
    },
    googleAnalytics: isProductionDeployment ? {
      trackingID: 'UA-2527438-21'
    } : undefined,
    navbar: {
      title: `Verdaccio - v${pkgJson.version}`,
      logo: {
        alt: 'Verdaccio Logo',
        src: 'img/verdaccio-tiny.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'what-is-verdaccio',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/help', label: 'Help', position: 'left' },        
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
              href: 'https://discordapp.com/invite/verdaccio',
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
    hideableSidebar: true,
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
        },
        blog: {
          blogTitle: 'Verdaccio Official Blog',
          blogDescription: 'The official Verdaccio NPM proxy registry blog',
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
