import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.dev.config.babel';
import ora from 'ora';
import env from '../src/config/env';

const compiler = webpack(config);
const spinner = ora('Compiler is running...').start();
compiler.hooks.done.tap('Verdaccio Dev Server', () => {
  if (!global.rebuild) {
    spinner.stop();
    console.log('Dev Server Listening at http://localhost:4872/');
    global.rebuild = true;
  }
});

new WebpackDevServer(compiler, {
  contentBase: `${env.DIST_PATH}`,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  quiet: true,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: true,
    hash: true,
    timings: true,
    chunks: true,
    chunkModules: false,
  },
  proxy: [{
      context: ['/-/verdaccio/logo', '/-/verdaccio/packages', '/-/static/logo.png'],
      target: 'http://localhost:4873',
  }],
}).listen(4872, 'localhost', function(err) {
  if (err) {
    return console.log(err);
  }
});
