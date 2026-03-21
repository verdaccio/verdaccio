import { Command, Option } from 'clipanion';
import buildDebug from 'debug';

import { PLUGIN_CATEGORY, PLUGIN_PREFIX } from '@verdaccio/core';

import { verifyPlugin } from '../verify-plugin';

const debug = buildDebug('verdaccio:plugin:verifier:cli');
const VALID_CATEGORIES = Object.values(PLUGIN_CATEGORY);

export class VerifyCommand extends Command {
  public static paths = [Command.Default];

  static usage = Command.Usage({
    description: 'Verify that a Verdaccio plugin can be loaded and passes sanity checks',
    details: `
      This command uses the same plugin loader that Verdaccio runs at startup
      (\`asyncLoadPlugin\` from \`@verdaccio/loaders\`) to verify that a plugin
      can be resolved, instantiated, and passes the required sanity checks
      for its category.

      The plugin is identified by its short name (as it appears in \`config.yaml\`),
      and the loader applies the prefix automatically. For example, \`my-auth\`
      resolves to \`verdaccio-my-auth\` in the plugins folder or \`node_modules\`.

      Scoped packages (e.g. \`@myorg/my-plugin\`) are used as-is without a prefix.

      Enable debug output with the DEBUG environment variable:
        DEBUG=verdaccio:plugin:verifier* verdaccio-plugin-verifier my-auth --category authentication
    `,
    examples: [
      [
        'Verify an auth plugin from a plugins folder',
        'verdaccio-plugin-verifier my-auth --category authentication --plugins-folder ./plugins',
      ],
      [
        'Verify a storage plugin installed via npm',
        'verdaccio-plugin-verifier my-storage --category storage',
      ],
      [
        'Verify a scoped plugin with a custom prefix',
        'verdaccio-plugin-verifier @myorg/my-plugin --category middleware --prefix mycompany',
      ],
    ],
  });

  private pluginPath = Option.String({
    required: true,
    name: 'plugin',
  });

  private category = Option.String('--category,-c', {
    required: true,
    description: `Plugin category: ${VALID_CATEGORIES.join(', ')}`,
  });

  private pluginsFolder = Option.String('--plugins-folder,-d', {
    description: 'Absolute path to the plugins directory (maps to config.plugins)',
  });

  private prefix = Option.String('--prefix,-p', {
    description: `Plugin name prefix (default: "${PLUGIN_PREFIX}")`,
  });

  public async execute(): Promise<number> {
    debug('command invoked with plugin=%o category=%o', this.pluginPath, this.category);
    debug('pluginsFolder=%o prefix=%o', this.pluginsFolder, this.prefix);

    if (!VALID_CATEGORIES.includes(this.category)) {
      this.context.stderr.write(
        `Error: Invalid category "${this.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}\n`
      );
      return 1;
    }

    const result = await verifyPlugin({
      pluginPath: this.pluginPath,
      category: this.category,
      pluginsFolder: this.pluginsFolder,
      prefix: this.prefix,
    });

    if (result.success) {
      this.context.stdout.write(
        `Plugin "${result.pluginName}" verified successfully for category "${result.category}" (${result.pluginsLoaded} instance(s) loaded)\n`
      );
      return 0;
    }

    this.context.stderr.write(`Plugin verification failed: ${result.error}\n`);
    if (result.diagnostics && result.diagnostics.length > 0) {
      this.context.stderr.write('\nDiagnostics:\n');
      for (const step of result.diagnostics) {
        const icon = step.pass ? 'PASS' : 'FAIL';
        this.context.stderr.write(`  [${icon}] ${step.phase}: ${step.message}\n`);
      }
    }
    return 1;
  }
}
