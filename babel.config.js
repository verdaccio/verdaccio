const isESM = process.env.BABEL_MODULE === 'esm';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: '18' },
        modules: isESM ? false : 'commonjs',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['PACKAGE_VERSION'],
      },
    ],
  ],
};
