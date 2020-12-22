module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: [
          'last 5 versions',
          'FireFox >= 44',
          'Safari >= 7',
          'Explorer 11',
          'last 4 Edge versions',
        ],
        bugfixes: true,
        modules: 'auto',
        debug: false,
      },
    ],
    '@babel/preset-react',
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // FIXME: filter in production
    'react-hot-loader/babel',
    '@babel/transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'emotion',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            bugfixes: true,
            debug: false,
          },
        ],
        '@babel/preset-react',
        '@babel/typescript',
      ],
      plugins: ['dynamic-import-node'],
    },
  },
  ignore: ['**/*.d.ts'],
};
