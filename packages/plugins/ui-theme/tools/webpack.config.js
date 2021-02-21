const StyleLintPlugin = require('stylelint-webpack-plugin');

const env = require('../config/env');

module.exports = {
  entry: `${env.SRC_ROOT}/index.tsx`,

  output: {
    path: `${env.APP_ROOT}/static/`,
    filename: '[name].[fullhash].js',
    publicPath: '/-/static/',
  },

  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules'],
    alias: {
      'verdaccio-ui/components': `${env.SRC_ROOT}/components`,
      'verdaccio-ui/design-tokens': `${env.SRC_ROOT}/design-tokens`,
      'verdaccio-ui/utils': `${env.SRC_ROOT}/utils`,
    },
  },

  plugins: [
    new StyleLintPlugin({
      files: ['src/**/styles.ts'],
      failOnError: false,
      emitErrors: true,
    }),
  ],

  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset/inline',
      },
      {
        test: /\.css$/,
        type: 'asset/inline',
      },
      /* Typescript loader */
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  stats: {
    children: false,
  },
};
