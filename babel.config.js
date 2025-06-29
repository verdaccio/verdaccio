module.exports = {
  presets: [['@babel/preset-env', { targets: { node: '18' } }], '@babel/preset-typescript'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['PACKAGE_VERSION'],
      },
    ],
  ],
};
