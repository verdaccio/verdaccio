import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import baseConfig from './webpack.config'
import env from '../../config/env'

export default {
  ...baseConfig,
  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:4872',
      'webpack/hot/only-dev-server',
      `${env.SRC_ROOT}/webui/src/index.jsx`
    ]
  },

  output: {
    ...baseConfig.output,
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: true,
      'process.env.NODE_ENV': '"development"'
    }),
    new HTMLWebpackPlugin({
      title: 'Verdaccio',
      filename: 'index.html',
      verdaccioURL: '//localhost:4873/-/',
      template: `${env.SRC_ROOT}/webui/template.html`,
      debug: true,
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
}
