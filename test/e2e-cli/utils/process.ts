import { spawn } from 'child_process';
import { SpawnOptions } from 'child_process';
import readline from 'readline';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:e2e:process');

export type ExecOutput = {
  stdout: string;
  stderr: string;
};

export async function _exec(options: SpawnOptions, cmd, args): Promise<ExecOutput> {
  debug('start _exec %o %o %o', options, cmd, args);
  let stdout = '';
  let stderr;
  const env = options.env;
  debug(`Running \`${cmd} ${args.join(' ')}`);
  debug(`CWD: %o`, options.cwd);
  debug(`ENV: ${JSON.stringify(env)}`);
  const spawnOptions = {
    cwd: options.cwd,
    stdio: options.stdio || 'pipe',
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
    stdout += line;
  });

  const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
  return new Promise((resolve, reject) => {
    childProcess.on('exit', (error) => {
      if (!error) {
        resolve({ stdout, stderr });
      } else {
        err.message += `${error}...\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`;
        reject({ stdout, stderr: err });
      }
    });
  });
}

// export function execAndWaitForOutputToMatch(
//   cmd: string,
//   args: string[],
//   match: RegExp,
//   spawnOptions: SpawnOptions = {}
// ): any {
//   return _exec({ waitForMatch: match, ...spawnOptions, silence: true }, cmd, args);
// }

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

export function npm(...args): Promise<ExecOutput> {
  return _exec({}, 'npm', args);
}

export function yarn(...args): Promise<ExecOutput> {
  return _exec({}, 'yarn', args);
}

export function pnpm(...args): Promise<ExecOutput> {
  return _exec({}, 'pnpm', args);
}

export function pnpmWithCwd(cwd, ...args): Promise<ExecOutput> {
  return _exec({ cwd }, 'pnpm', args);
}

export function yarnWithCwd(cwd, ...args): Promise<ExecOutput> {
  return _exec({ cwd }, 'yarn', args);
}

export function nodeCwd(cwd, ...args): Promise<ExecOutput> {
  return _exec({ cwd }, 'yarn', args);
}

export function silentNpm(...args): Promise<ExecOutput> {
  debug('run silent npm %o', args);
  return _exec({ silent: true }, 'npm', args);
}
