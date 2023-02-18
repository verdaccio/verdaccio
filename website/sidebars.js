// @ts-check
module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'installation',
        'what-is-verdaccio',
        'cli',
        {
          type: 'category',
          label: 'Setting up Verdaccio',
          items: ['cli-registry', 'setup-npm', 'setup-yarn', 'setup-pnpm'],
        },
        'who-is-using',
        'best',
        'docker',
        'protect-your-dependencies',
        'e2e',
        'verdaccio-programmatically',
        'security-policy',
        'logo',
        'third-party',
        {
          type: 'category',
          label: 'Uses Cases',
          items: ['caching', 'linking-remote-registry'],
        },
        'articles',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'configuration',
        'uplinks',
        'packages',
        'authentication',
        'notifications',
        'logger',
        {
          type: 'category',
          label: 'User Interface',
          items: ['webui', 'ui-components'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Server',
      items: ['server-configuration', 'reverse-proxy', 'ssl', 'windows', 'iss-server'],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'plugins',
        'dev-plugins',
        {
          type: 'link',
          label: 'Search Plugins',
          href: '/dev/plugins-search',
        },
        {
          type: 'category',
          label: 'Dev Guides',
          items: [
            'plugin-generator',
            'plugin-auth',
            'plugin-middleware',
            'plugin-storage',
            'plugin-theme',
            'plugin-filter',
          ],
        },
        'node-api',
      ],
    },
    {
      type: 'category',
      label: 'DevOps',
      items: [
        'kubernetes',
        'ci',
        {
          type: 'category',
          label: 'Cloud',
          items: ['amazon'],
        },
        {
          type: 'category',
          label: 'Tools',
          items: ['ansible', 'puppet', 'chef'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: ['aws'],
    },
  ],
  api: [
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'autogenerated',
          dirName: 'api',
        },
      ],
    },
  ],
};
