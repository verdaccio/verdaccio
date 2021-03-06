const HTMLWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { merge } = require('webpack-merge');

const env = require('../config/env');

const getPackageJson = require('./getPackageJson');
const baseConfig = require('./webpack.config');

const { version, name, license } = getPackageJson('version', 'name', 'license');

const banner = `
    Name: [name]
    Generated on: ${Date.now()}
    Package: ${name}
    Version: v${version}
    License: ${license}
    https://www.verdaccio.org
    `;

const prodConf = {
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',

  entry: {
    main: ['@babel/polyfill', 'whatwg-fetch', `${env.SRC_ROOT}/index.tsx`],
  },

  module: {
    rules: [],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: false,
      'process.env.NODE_ENV': '"production"',
      __APP_VERSION__: `"${version}"`,
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    // FIXME:  @deprecated remove
    new HTMLWebpackPlugin({
      title: 'ToReplaceByTitle',
      __UI_OPTIONS: 'ToReplaceByVerdaccioUI',
      scope: 'ToReplaceByScope',
      basename: 'ToReplaceByPrefix',
      logo: 'ToReplaceByLogo',
      primary_color: 'ToReplaceByPrimaryColor',
      filename: 'index.html',
      favicon: `${env.SRC_ROOT}/template/favicon.ico`,
      verdaccioURL: 'ToReplaceByVerdaccio',
      version_app: 'ToReplaceByVersion',
      template: `${env.SRC_ROOT}/template/index.html`,
      debug: false,
      inject: true,
    }),
    new WebpackManifestPlugin({
      removeKeyHash: true,
    }),
    new webpack.BannerPlugin(banner),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

prodConf.module.rules = baseConfig.module.rules
  .filter(
    (loader) =>
      Array.isArray(loader.use) && loader.use.find((v) => /css/.test(v.loader.split('-')[0]))
  )
  .forEach((loader) => {
    loader.use = [MiniCssExtractPlugin.loader].concat(_.tail(loader.use));
  });

module.exports = merge(baseConfig, prodConf);
