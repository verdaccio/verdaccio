import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import baseConfig from './webpack.config';
import env from '../src/config/env';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import getPackageJson from './getPackageJson';

export default {
  ...baseConfig,

  mode: 'development',

  entry: {
    main: [
      'whatwg-fetch',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:4872',
      'webpack/hot/only-dev-server',
      `${env.SRC_ROOT}/webui/index.js`,
    ],
  },

  output: {
    ...baseConfig.output,
    publicPath: '/',
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: true,
      __APP_VERSION__: `"${getPackageJson('version')}"`,
    }),
    new HTMLWebpackPlugin({
      title: 'Verdaccio',
      scope: '',
      filename: 'index.html',
      verdaccioURL: '//localhost:4873',
      template: `${env.SRC_ROOT}/webui/template/index.html`,
      debug: true,
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new StyleLintPlugin({
      files: ['src/webui/**/styles.js'],
      failOnError: false,
      emitErrors: false
    }),
  ],
};
