const env = require('../src/config/env');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: `${env.SRC_ROOT}/webui/src/index.js`,

  output: {
    path: `${env.APP_ROOT}/static/`,
    filename: '[name].[hash].js',
    publicPath: 'ToReplaceByVerdaccio/-/static',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new StyleLintPlugin({
      files: ['src/**/*.scss'],
      failOnError: false,
      emitErrors: true,
      syntax: 'scss',
    }),
  ],

  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -20,
          chunks: 'all',
        },
      },
    },
  },

  module: {
    rules: [
      /* Pre loader */
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },

      /* Normal loader */
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: 'fonts/[hash].[ext]',
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              module: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },

  stats: {
    children: false,
  },
};
