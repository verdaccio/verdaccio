import { Cli } from 'clipanion';

import { VerifyCommand } from './commands/verify';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: 'verdaccio-plugin-verifier',
  binaryName: `${node} ${app}`,
  binaryVersion: '1.0.0-next-9.0',
});

cli.register(VerifyCommand);
cli.runExit(args, Cli.defaultContext);
