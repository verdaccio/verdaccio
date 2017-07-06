import env from '../../config/env'

const isDev = process.env.NODE_ENV === 'development'

export default {
  entry: `${env.SRC_ROOT}/webui/src/index.jsx`,

	output: {
    path: `${env.APP_ROOT}/static/`,
    filename: '[name].[hash].js'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      /* Pre loader */
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'eslint-loader'
      },

      /* Normal loader */
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: 'fonts/[hash].[ext]'
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              module: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'ruby-sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },

  devtool: isDev ? 'source-map' : 'eval',

  stats: {children: false}
};
