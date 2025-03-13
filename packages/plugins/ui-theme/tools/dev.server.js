import ora from 'ora';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import env from '../config/env';
import config from './webpack.dev.config.babel';

const compiler = webpack(config);
const spinner = ora('Compiler is running...').start();
const port = 4873;
compiler.hooks.done.tap('Verdaccio Dev Server', () => {
  if (!global.rebuild) {
    spinner.stop();
    console.log(`Dev Server Listening at http://localhost:${port}/`);
    global.rebuild = true;
  }
});

// Create dev server instance with v5 configuration
const devServer = new WebpackDevServer(
  {
    host: '0.0.0.0',
    port,
    static: {
      directory: env.DIST_PATH,
      publicPath: config.output.publicPath,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: [
      {
        context: ['/-/verdaccio/**', '**/*.tgz'],
        target: 'http://localhost:8000',
      },
    ],
  },
  compiler
);

// Use the async start method
devServer.startCallback((err) => {
  if (err) {
    console.log(err);
    return;
  }
});
