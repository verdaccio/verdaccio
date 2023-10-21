import { spawn } from 'child_process';
import { SpawnOptions } from 'child_process';
import buildDebug from 'debug';
import { createInterface } from 'readline';

const debug = buildDebug('verdaccio:e2e:process');

export type ExecOutput = {
  stdout: string;
  stderr: string;
};

export async function exec(options: SpawnOptions, cmd, args): Promise<ExecOutput> {
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
    env: process.env,
  };

  if (process.platform.startsWith('win')) {
    args.unshift('/c', cmd);
    cmd = 'cmd.exe';
    spawnOptions['stdio'] = 'pipe';
  }

  const childProcess = spawn(cmd, args, spawnOptions);
  if (childProcess.stdout) {
    const rl = createInterface({ input: childProcess.stdout });

    rl.on('line', function (line) {
      stdout += line;
    });
  }

  const err = new Error(`Running "${cmd} ${args.join(' ')}" returned error code `);
  return new Promise((resolve, reject) => {
    childProcess.on('exit', (error) => {
      if (!error) {
        resolve({ stdout, stderr });
      } else {
        err.message += `${error}...\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`;
        const errorObj = { stdout, stderr: err };
        return reject(errorObj);
      }
    });
  });
}
