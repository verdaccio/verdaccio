module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '16',
        },
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/proposal-class-properties',
    '@babel/syntax-dynamic-import',
  ],
  ignore: ['**/*.d.ts'],
};
