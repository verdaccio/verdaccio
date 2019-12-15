import * as child_process from 'child_process';
import {SpawnOptions} from "child_process";

export async function _exec(options, cmd, args) {
  let stdout = '';
  let stderr = '';
  const flags = [];
  const cwd = process.cwd();
  const env = options.env;
  console.log(`Running \`${cmd} ${args.map(x => `"${x}"`).join(' ')}\`${flags}...`);
  console.log(`CWD: ${cwd}`);
  console.log(`ENV: ${JSON.stringify(env)}`);
  const spawnOptions = {
    cwd,
    ...env ? { env } : {},
  };

  if (process.platform.startsWith('win')) {
    args.unshift('/c', cmd);
    cmd = 'cmd.exe';
    spawnOptions['stdio'] = 'pipe';
  }


  const childProcess = child_process.spawn(cmd, args, spawnOptions);
  childProcess.stdout.on('data', (data) => {
    stdout += data.toString('utf-8');
    if (options.silent) {
      return;
    }
    data.toString('utf-8')
      .split(/[\n\r]+/)
      .filter(line => line !== '')
      .forEach(line => console.log('  ' + line));
  });
  childProcess.stderr.on('data', (data) => {
    stderr += data.toString('utf-8');
    if (options.silent) {
      return;
    }
    data.toString('utf-8')
      .split(/[\n\r]+/)
      .filter(line => line !== '')
      .forEach(line => console.error(('  ' + line)));
  });

  // Create the error here so the stack shows who called this function.
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
        if (data.toString().match(match)) {
          resolve({ok: true, stdout, stderr });
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
    spawnOptions: SpawnOptions = {}): any {
  return _exec({ waitForMatch: match, ...spawnOptions }, cmd, args);
}


export function npm(...args) {
  return _exec({}, 'npm', args);
}

export function silentNpm(...args) {
  return _exec({silent: true}, 'npm', args);
}
