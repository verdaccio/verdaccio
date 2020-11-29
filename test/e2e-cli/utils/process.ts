import { spawn } from 'child_process';
import { SpawnOptions } from 'child_process';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:e2e:exec');

export async function _exec(options, cmd, args) {
  let stdout = '';
  let stderr = '';
  const flags = [];
  const cwd = process.cwd();
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
  childProcess.stdout.on('data', (data) => {
    stdout += data.toString('utf-8');
    if (options.silent) {
      return;
    }

    data
      .toString('utf-8')
      .split(/[\n\r]+/)
      .filter((line) => line !== '')
      .forEach((line) => debug('  ' + line));
  });

  childProcess.stderr.on('data', (data) => {
    stderr += data.toString('utf-8');
    if (options.silent) {
      return;
    }

    data
      .toString('utf-8')
      .split(/[\n\r]+/)
      .filter((line) => line !== '')
      .forEach((line) => console.error('  ' + line));
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

    if (options.waitForMatch) {
      const match = options.waitForMatch;
      childProcess.stdout.on('data', (data) => {
        debug('data=> %o', data);
        if (data.toString().match(match)) {
          resolve({ ok: true, stdout, stderr });
        }
      });
      childProcess.stderr.on('data', (data) => {
        if (data.toString().match(match)) {
          resolve({ stdout, stderr });
        }
      });
    }
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

export function pnpm(rootFolder, ...args) {
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

export function runVerdaccio(cmd, installation, args, match: RegExp): any {
  return _exec({ cwd: installation, silent: true, waitForMatch: match }, cmd, args);
}

export function silentNpm(...args) {
  return _exec({ silent: true }, 'npm', args);
}
