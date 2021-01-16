/* eslint-disable max-len */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './build.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'nosources-source-map',
  plugins: [
    // esprima is only needed for parsing !!js/function, which isn't part of the FAILSAFE_SCHEMA.
    // Unfortunately, js-yaml declares it as a hard dependency and requires the entire module,
    // which causes webpack to add 0.13 MB of unused code to the bundle.
    // Fortunately, js-yaml wraps the require call inside a try / catch block, so we can just ignore it.
    // Reference: https://github.com/nodeca/js-yaml/blob/34e5072f43fd36b08aaaad433da73c10d47c41e5/lib/js-yaml/type/js/function.js#L15
    new webpack.IgnorePlugin({
      resourceRegExp: /^esprima$/,
      contextRegExp: /js-yaml/,
    }),
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: `#!/usr/bin/env node\n/* eslint-disable */`,
      raw: true,
    }),
  ],
  target: 'node',
  resolve: {
    alias: {
      ['verdaccio-htpasswd']: path.resolve(__dirname, '../core//htpasswd/build/index.js'),
    },
    fallback: {
      // jsdom -> canvas is not required for the purpose of backend
      canvas: false,
    },
  },
};
