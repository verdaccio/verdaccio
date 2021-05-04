import fs from 'fs';

import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import yalm from 'js-yaml';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import webpack from 'webpack';

import env from '../config/env';

import getPackageJson from './getPackageJson';
import baseConfig from './webpack.config';

const configJsonFormat = yalm.safeLoad(fs.readFileSync('./tools/_verdaccio.config.yaml', 'utf8'));
export default {
  ...baseConfig,
  mode: 'development',
  entry: {
    main: [
      'whatwg-fetch',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:4873',
      'webpack/hot/only-dev-server',
      `${env.SRC_ROOT}/index.tsx`,
    ],
  },

  output: {
    ...baseConfig.output,
    publicPath: '/',
  },

  devtool: 'inline-cheap-module-source-map',

  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: true,
      __APP_VERSION__: `"${getPackageJson('version')}"`,
    }),
    new HTMLWebpackPlugin({
      __UI_OPTIONS: JSON.stringify({
        ...configJsonFormat.web,
        filename: 'index.html',
        verdaccioURL: '//localhost:4873',
        base: new URL('/', 'http://localhost:4873'),
      }),
      template: `${env.SRC_ROOT}/template/index.html`,
      debug: true,
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new StyleLintPlugin({
      files: ['src/**/styles.ts'],
      failOnError: false,
      emitErrors: false,
    }),
  ],
};
