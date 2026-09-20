import chalk from 'chalk';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import { promisify } from 'node:util';

import { findExistingConfigFile, getConfigParsed } from '@verdaccio/config';
import type { ConfigYaml } from '@verdaccio/types';

const run = promisify(execFile);

async function exec(cmd: string, args: string[]): Promise<string | null> {
  try {
    const { stdout } = await run(cmd, args, { timeout: 5000 });
    return stdout.trim();
  } catch {
    return null;
  }
}

/** Extract a `x.y.z` version out of a tool's `--version` output. */
export function parseVersion(raw: string): string {
  const match = raw.match(/\d+\.\d+\.\d+[^\s,]*/);
  return match ? match[0] : raw.replace(/^v/, '').trim();
}

/** Mask a path: keep the structure and the basename, replace each directory with `**`. */
export function maskPath(target: string): string {
  const parts = target.split(/[/\\]/);
  const last = parts.length - 1;
  return parts.map((segment, i) => (segment === '' || i === last ? segment : '**')).join('/');
}

function which(bin: string): Promise<string | null> {
  return exec('which', [bin]);
}

async function binary(label: string, bin: string, mask: boolean): Promise<string | null> {
  const location = await which(bin);
  if (location === null) {
    return null;
  }
  const raw = await exec(bin, ['--version']);
  if (raw === null) {
    return null;
  }
  const version = parseVersion(raw);
  return `    ${label}: ${version} - ${mask ? maskPath(location) : location}`;
}

async function osInfo(): Promise<string> {
  if (process.platform === 'darwin') {
    const name = await exec('sw_vers', ['-productName']);
    const version = await exec('sw_vers', ['-productVersion']);
    if (name && version) {
      return `${name} ${version}`;
    }
  }
  if (process.platform === 'linux') {
    try {
      const release = await fs.readFile('/etc/os-release', 'utf8');
      const match = release.match(/PRETTY_NAME="?([^"\n]+)/);
      if (match) {
        return match[1];
      }
    } catch {
      // fall through to the generic label
    }
  }
  return `${process.platform} ${os.release()}`;
}

function cpuInfo(): string {
  const cpus = os.cpus();
  const model = cpus[0]?.model ?? 'unknown';
  return `(${cpus.length}) ${os.arch()} ${model}`;
}

async function globalVerdaccio(): Promise<string | null> {
  const raw = await exec('npm', ['ls', '-g', '--depth=0', '--json', 'verdaccio']);
  if (raw === null) {
    return null;
  }
  try {
    const version = JSON.parse(raw)?.dependencies?.verdaccio?.version;
    return version ? `    verdaccio: ${version}` : null;
  } catch {
    return null;
  }
}

/** Configured plugins and whether the storage is the built-in local filesystem. */
export function verdaccioConfigLines(
  config: ConfigYaml,
  configPath?: string,
  mask = false
): string[] {
  const lines = ['  Verdaccio:'];
  if (configPath) {
    lines.push(`    config: ${mask ? maskPath(configPath) : configPath}`);
  }
  const store = config.store ? Object.keys(config.store) : [];
  lines.push(
    store.length === 0
      ? `    storage: local filesystem${config.storage ? ` (${mask ? maskPath(config.storage) : config.storage})` : ''}`
      : `    storage: ${store.join(', ')} plugin`
  );
  const auth = Object.keys(config.auth ?? {});
  lines.push(`    auth plugins: ${auth.length > 0 ? auth.join(', ') : '(none)'}`);
  const middlewares = Object.keys(config.middlewares ?? {});
  if (middlewares.length > 0) {
    lines.push(`    middleware plugins: ${middlewares.join(', ')}`);
  }
  const filters = Object.keys(config.filters ?? {});
  if (filters.length > 0) {
    lines.push(`    filter plugins: ${filters.join(', ')}`);
  }
  return lines;
}

async function verdaccioInfo(mask: boolean): Promise<string[]> {
  try {
    // side-effect-free lookup: --info must never create a config file
    const configPath = findExistingConfigFile();
    if (configPath === undefined) {
      return [];
    }
    return verdaccioConfigLines(getConfigParsed(configPath), configPath, mask);
  } catch {
    return [];
  }
}

/** A one-line hint drawn in a box, used to point at the --mask option. */
function hintBox(text: string): string {
  const rule = '─'.repeat(text.length + 2);
  return chalk.cyan(`┌${rule}┐\n│ ${text} │\n└${rule}┘`);
}

/**
 * Local replacement for `envinfo` — the same environment report the CLI used to
 * print, minus the browsers section, plus the configured plugins and storage.
 */
export async function getEnvInfo(mask = false): Promise<string> {
  const lines: string[] = ['', 'Environment Info:', '  System:'];
  lines.push(`    OS: ${await osInfo()}`);
  lines.push(`    CPU: ${cpuInfo()}`);

  // binary/version detection relies on `which` and unshimmed executables, which are
  // unreliable on Windows — skip it there rather than print broken or empty entries
  if (process.platform !== 'win32') {
    const binaries = (
      await Promise.all([
        binary('node', 'node', mask),
        binary('yarn', 'yarn', mask),
        binary('npm', 'npm', mask),
        binary('pnpm', 'pnpm', mask),
      ])
    ).filter((line): line is string => line !== null);
    if (binaries.length > 0) {
      lines.push('  Binaries:', ...binaries);
    }

    const docker = await binary('Docker', 'docker', mask);
    if (docker) {
      lines.push('  Virtualization:', docker);
    }

    const verdaccio = await globalVerdaccio();
    if (verdaccio) {
      lines.push('  npmGlobalPackages:', verdaccio);
    }
  }

  lines.push(...(await verdaccioInfo(mask)));

  let report = lines.join('\n') + '\n';
  if (!mask) {
    report += `\n${hintBox('tip: add --mask to obscure file paths (keeps the structure)')}\n`;
  }
  return report;
}
