const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const env = require('../src/config/env');

module.exports = {
  entry: `${env.SRC_ROOT}/webui/src/index.js`,
  devtool: 'source-map',
	output: {
    path: `${env.APP_ROOT}/static/`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          failOnError: true,
        }
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
         test: /\.(jpe?g|png|gif|svg)$/i,
         use: 'file-loader?name=/[name].[ext]'
      },
      {
          test: /\.(ttf|eot|woff|woff2|svg)$/,
          loader: 'url-loader?limit=50000&name=fonts/[hash].[ext]'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true)
        }
    })
  ],
  resolve: {
    extensions: ['.js', '.css']
  }
};
