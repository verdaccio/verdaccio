import chalk from 'chalk';
import { Command, Option } from 'clipanion';
import readline from 'node:readline';
import readlinePromises from 'node:readline/promises';

import type { Auth } from '@verdaccio/auth';
import type { Config } from '@verdaccio/config';
import type { RemoteUser } from '@verdaccio/types';

import { authenticateUser, resolveRemoteUser } from './access';

/**
 * Shared base for the experimental `verdaccio-admin storage` command group.
 *
 * Every storage subcommand emits the experimental warning once, shares the
 * `--config` flag and resolves the operator identity so operations can be gated
 * by the same package-access ACL the registry enforces.
 */
export abstract class StorageBaseCommand extends Command {
  protected configPath = Option.String('-c,--config', {
    description: 'path to the verdaccio configuration file',
  });

  protected yes = Option.Boolean('-y,--yes', false, {
    description: 'skip the confirmation prompt',
  });

  protected warnExperimental(): void {
    this.context.stderr.write(
      chalk.yellow(`⚠ "verdaccio-admin storage" is experimental and may change or be removed\n`)
    );
  }

  /** Interactive y/N confirmation; `--yes` skips it, non-TTY refuses. */
  protected async confirm(message: string): Promise<boolean> {
    if (this.yes) {
      return true;
    }
    const answer = await this.ask(message);
    return answer !== null && /^y(es)?$/i.test(answer);
  }

  /** Ask a free-form question; returns the trimmed answer, or null when not a TTY. */
  protected async ask(
    message: string,
    nonTtyHint = `pass --yes to proceed non-interactively`
  ): Promise<string | null> {
    const input = this.context.stdin as NodeJS.ReadStream;
    if (!input.isTTY) {
      this.context.stderr.write(`not a TTY; ${nonTtyHint}\n`);
      return null;
    }
    const rl = readlinePromises.createInterface({ input, output: this.context.stdout });
    try {
      return (await rl.question(message)).trim();
    } finally {
      rl.close();
    }
  }
}

/**
 * Base for the storage subcommands whose per-package operations are gated by the
 * package-access ACL (`cache`, `view`, `doctor`). It adds the login options and
 * resolves the operator. The whole-storage commands (`migrate`, `backup`, `stats`)
 * are local admin operations governed by filesystem permissions, so they extend
 * {@link StorageBaseCommand} and do not accept these options.
 */
export abstract class AuthStorageCommand extends StorageBaseCommand {
  protected token = Option.String('--token', {
    description: 'JWT auth token used for package-access checks',
  });

  protected user = Option.String('-u,--user', {
    description: 'log in as this user (validated against the configured auth plugin)',
  });

  protected password = Option.String('--password', {
    description: 'password for --user (prompted if omitted)',
  });

  /** Resolve the operator: `--token`, `--user`/password login, or anonymous. */
  protected async resolveOperator(config: Config, auth: Auth): Promise<RemoteUser> {
    if (this.token) {
      return resolveRemoteUser(config, this.token);
    }
    if (this.user) {
      const password = this.password ?? (await this.promptPassword());
      return authenticateUser(auth, this.user, password);
    }
    return resolveRemoteUser(config, undefined);
  }

  private promptPassword(): Promise<string> {
    const input = this.context.stdin as NodeJS.ReadStream;
    const output = this.context.stdout as NodeJS.WriteStream;
    return new Promise((resolve, reject) => {
      if (!input.isTTY) {
        reject(new Error('password required: pass --password or run in a TTY'));
        return;
      }
      const rl = readline.createInterface({ input, output, terminal: true });
      // suppress echo so the typed password is not shown
      (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = () => {};
      output.write(`Password: `);
      rl.question(``, (answer) => {
        rl.close();
        output.write(`\n`);
        resolve(answer);
      });
    });
  }
}
