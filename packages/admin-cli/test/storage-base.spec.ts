import { PassThrough } from 'node:stream';
import { describe, expect, test } from 'vitest';

import { AuthStorageCommand } from '../src/commands/storage/base';

class TestCommand extends AuthStorageCommand {
  public async execute(): Promise<number> {
    return 0;
  }
  public prompt(): Promise<string> {
    // exercise the protected password prompt
    return (this as unknown as { promptPassword(): Promise<string> }).promptPassword();
  }
}

function makeCommand(): { cmd: TestCommand; stdin: PassThrough } {
  const cmd = new TestCommand();
  const stdin = new PassThrough() as PassThrough & { isTTY: boolean; setRawMode: () => void };
  stdin.isTTY = true;
  stdin.setRawMode = () => stdin;
  const out = new PassThrough();
  out.resume();
  (cmd as unknown as { context: unknown }).context = { stdin, stdout: out, stderr: out };
  return { cmd, stdin };
}

describe('promptPassword', () => {
  test('resolves the typed answer', async () => {
    const { cmd, stdin } = makeCommand();
    const pending = cmd.prompt();
    stdin.write('hunter2\n');
    await expect(pending).resolves.toBe('hunter2');
  });

  test('rejects when the prompt closes without input (Ctrl+D)', async () => {
    const { cmd, stdin } = makeCommand();
    const pending = cmd.prompt();
    stdin.end(); // EOF closes the readline interface before any answer
    await expect(pending).rejects.toThrow(/closed without input/);
  });
});
