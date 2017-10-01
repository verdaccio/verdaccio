const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config');
const env = require('../src/config/env');
const _ = require('lodash');
const merge = require('webpack-merge');

const prodConf = {
  entry: {
    main: ['babel-polyfill', `${env.SRC_ROOT}/webui/src/index.js`],
  },

  module: {
    rules: [],
  },

  plugins: [
    new webpack.DefinePlugin({
      '__DEBUG__': false,
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin('style.[contenthash].css'),
    new HTMLWebpackPlugin({
      title: 'ToReplaceByTitle',
      filename: 'index.html',
      verdaccioURL: 'ToReplaceByVerdaccio',
      template: `${env.SRC_ROOT}/webui/template/index.html`,
      debug: false,
      inject: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

prodConf.module.rules = baseConfig.module.rules
  .filter((loader) =>
    Array.isArray(loader.use) && loader.use.find((v) => /css/.test(v.loader.split('-')[0]))
  ).forEach((loader) => {
  loader.use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: _.tail(loader.use),
  });
});

module.exports = merge(baseConfig, prodConf);
