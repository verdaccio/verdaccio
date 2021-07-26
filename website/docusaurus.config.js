// @ts-check

const isDeployPreview = process.env.CONTEXT === 'deploy-preview';

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
  plugins: ['docusaurus-plugin-sass'],
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
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      appId: 'YOUR_APP_ID',
      contextualSearch: true,
      searchParameters: {},
    },
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
      copyright: `Copyright © ${new Date().getFullYear()} Verdaccio. Built with Docusaurus.`,
    },
    sidebarCollapsible: true,
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
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
          // Please change this to your repo.
          editUrl:
            'https://github.com/verdaccio/docusaurus/edit/master/website/',
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
          // Please change this to your repo.
          editUrl:
            'https://github.com/verdaccio/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
};
