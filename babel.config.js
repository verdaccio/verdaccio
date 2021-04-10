module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '12',
        },
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/syntax-dynamic-import',
  ],
  ignore: ['**/*.d.ts'],
};
