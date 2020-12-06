import { spawn } from 'child_process';
import { SpawnOptions } from 'child_process';
import readline from 'readline';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:e2e:process');

export async function _exec(options, cmd, args) {
  debug('start _exec %o %o %o', options, cmd, args);
  let stdout = '';
  let stderr = '';
  const flags = [];
  const env = options.env;
  debug(`Running \`${cmd} ${args.map((x) => `"${x}"`).join(' ')}\`${flags}...`);
  debug(`CWD: %o`, options.cwd);
  debug(`ENV: ${JSON.stringify(env)}`);
  const spawnOptions = {
    cwd: options.cwd,
    silent: false,
    ...(env ? { env } : {}),
  };

  if (process.platform.startsWith('win')) {
    args.unshift('/c', cmd);
    cmd = 'cmd.exe';
    spawnOptions['stdio'] = 'pipe';
  }

  const childProcess = spawn(cmd, args, spawnOptions);
  const rl = readline.createInterface({ input: childProcess.stdout });

  rl.on('line', function (line) {
    // console.log('--', line);
    stdout += line;
  });

  const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
  return new Promise((resolve, reject) => {
    childProcess.on('exit', (error) => {
      if (!error) {
        resolve({ stdout, stderr });
      } else {
        err.message += `${error}...\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`;
        reject(err);
      }
    });
  });
}

export function execAndWaitForOutputToMatch(
  cmd: string,
  args: string[],
  match: RegExp,
  spawnOptions: SpawnOptions = {}
): any {
  return _exec({ waitForMatch: match, ...spawnOptions, silence: true }, cmd, args);
}

export function pnpmGlobal(rootFolder, ...args) {
  const pnpmCmd = require.resolve('pnpm');
  debug('pnpmCommand %o', pnpmCmd);
  debug('run pnpm on %o', rootFolder);
  return _exec(
    {
      cwd: rootFolder,
    },
    'pnpm',
    args
  );
}

export function npm(...args) {
  return _exec({}, 'npm', args);
}

export function yarn(...args) {
  return _exec({}, 'yarn', args);
}

export function pnpm(...args) {
  return _exec({}, 'pnpm', args);
}

export function runVerdaccio(cmd, installation, args, match: RegExp): any {
  debug('run verdaccio on %o %o %o', cmd, installation, args);
  return _exec({ cwd: installation, silent: true, waitForMatch: match }, cmd, args);
}

export function silentNpm(...args) {
  return _exec({ silent: false }, 'npm', args);
}
