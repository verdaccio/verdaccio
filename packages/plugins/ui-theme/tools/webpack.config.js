const env = require('../config/env');

module.exports = {
  entry: `${env.SRC_ROOT}/index.tsx`,

  output: {
    path: `${env.APP_ROOT}/static/`,
    filename: '[name].[fullhash].js',
    publicPath: '-/static/',
  },

  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules'],
    alias: {
      'verdaccio-ui/components': `${env.SRC_ROOT}/components`,
      'verdaccio-ui/utils': `${env.SRC_ROOT}/utils`,
      'verdaccio-ui/providers': `${env.SRC_ROOT}/providers`,
    },
  },

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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  stats: {
    children: false,
  },
};
