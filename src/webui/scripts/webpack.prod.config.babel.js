import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config'
import env from '../../config/env'
import _ from 'lodash'

baseConfig.module.rules
  .filter(loader =>
    Array.isArray(loader.use) && loader.use.find(v => /css/.test(v.loader.split('-')[0]))
  ).forEach(loader => {
  loader.use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: _.tail(loader.use)
  })
})

export default {
  ...baseConfig,
  entry: {
    main: `${env.SRC_ROOT}/webui/src/index.jsx`
  },

  output: {
    ...baseConfig.output,
    publicPath: 'ToReplaceByVerdaccio'
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEBUG__: false,
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('style.[contenthash].css'),
    new HTMLWebpackPlugin({
      title: 'Verdaccio',
      filename: 'index.html',
      verdaccioURL: 'ToReplaceByVerdaccio',
      template: `${env.SRC_ROOT}/webui/template.html`,
      debug: true,
      inject: true,
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
