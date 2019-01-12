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
      files: ['src/webui/**/styles.js'],
      failOnError: false,
      emitErrors: true
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
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader'
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          name: 'fonts/[name].[ext]',
          limit: 50,
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: `style-loader!css-loader?module&sourceMap=false&localIdentName=[path][name]__[local]--[hash:base64:5]
        !resolve-url-loader?keepQuery!sass-loader?sourceMap`
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
