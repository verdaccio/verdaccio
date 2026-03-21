import buildDebug from 'debug';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { PLUGIN_PREFIX } from '@verdaccio/core';

import { getSanityCheck } from './sanity-checks';
import type { DiagnosticStep, VerifyPluginOptions } from './types';

const debug = buildDebug('verdaccio:plugin:verifier:diagnostics');

// createRequire needs an absolute path; works in both ESM and CJS contexts
const requireModule = createRequire(
  typeof __filename !== 'undefined' ? __filename : import.meta.url
);

function isValidExport(plugin: any): boolean {
  return typeof plugin === 'function' || typeof plugin?.default === 'function';
}

function isES6(plugin: any): boolean {
  return plugin && typeof plugin === 'object' && 'default' in plugin;
}

/**
 * Resolve the ESM entry point for a directory-based plugin.
 * import() doesn't support directory imports, so we resolve via package.json.
 */
export function resolveEntryPoint(dirPath: string): string {
  const pkgPath = join(dirPath, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.exports) {
        const dotExport = pkg.exports['.'];
        if (typeof dotExport === 'string') {
          return join(dirPath, dotExport);
        }
        if (dotExport?.import?.default) {
          return join(dirPath, dotExport.import.default);
        }
        if (dotExport?.import && typeof dotExport.import === 'string') {
          return join(dirPath, dotExport.import);
        }
        if (dotExport?.default) {
          return join(dirPath, dotExport.default);
        }
      }
      if (pkg.module) {
        return join(dirPath, pkg.module);
      }
      if (pkg.main) {
        return join(dirPath, pkg.main);
      }
    } catch {
      // fall through
    }
  }
  return join(dirPath, 'index.js');
}

/**
 * Try to load a module, falling back from require() to import() for ESM.
 * Handles CJS require(), ESM require() shim errors (bundlers), and
 * ERR_REQUIRE_ESM — always falls through to dynamic import() on any
 * require() failure.
 */
async function tryResolve(modulePath: string): Promise<{ module: any; error?: string }> {
  // Try require() first (fast path for CJS modules)
  try {
    return { module: requireModule(modulePath) };
  } catch (requireErr: any) {
    debug('require() failed for %o: %s — trying dynamic import', modulePath, requireErr.message);
  }

  // Fallback to dynamic import() for ESM modules
  try {
    let importPath = modulePath;
    if (existsSync(modulePath) && existsSync(join(modulePath, 'package.json'))) {
      importPath = resolveEntryPoint(modulePath);
      debug('resolved ESM entry point: %o', importPath);
    }
    const importUrl = importPath.startsWith('/') ? pathToFileURL(importPath).href : importPath;
    const mod = await import(importUrl);
    return { module: mod };
  } catch (importErr: any) {
    return { module: null, error: importErr.message };
  }
}

/**
 * Runs step-by-step diagnostics to identify exactly which phase of
 * plugin loading fails. This replicates the same resolution logic
 * as `asyncLoadPlugin` but tests each step independently.
 */
export async function runDiagnostics(options: VerifyPluginOptions): Promise<DiagnosticStep[]> {
  const {
    pluginPath,
    category,
    pluginConfig = {},
    sanityCheck: customSanityCheck,
    prefix = PLUGIN_PREFIX,
    pluginsFolder,
  } = options;

  const steps: DiagnosticStep[] = [];
  const isScoped = pluginPath.startsWith('@') && pluginPath.includes('/');
  const pluginName = isScoped ? pluginPath : `${prefix}-${pluginPath}`;

  debug('running diagnostics for %o (resolved name: %o)', pluginPath, pluginName);

  // --- Phase 1: Resolve ---
  let pluginModule: any = null;
  let resolvedFrom = '';

  // Try plugins folder first
  if (pluginsFolder) {
    const absFolder = resolve(pluginsFolder);
    const pluginDir = join(absFolder, pluginName);
    debug('checking plugins folder: %o', pluginDir);

    if (!existsSync(absFolder)) {
      steps.push({
        phase: 'resolve',
        pass: false,
        message: `Plugins folder does not exist: ${absFolder}`,
      });
      return steps;
    }

    if (!existsSync(pluginDir)) {
      debug('plugin directory not found: %o', pluginDir);
      steps.push({
        phase: 'resolve',
        pass: false,
        message: `Plugin directory not found: ${pluginDir} — expected a folder named "${pluginName}" inside "${absFolder}"`,
      });
      return steps;
    }

    const result = await tryResolve(pluginDir);
    if (result.module) {
      pluginModule = result.module;
      resolvedFrom = pluginDir;
      debug('resolved from plugins folder: %o', pluginDir);
    } else {
      const missingDep = parseMissingDependency(result.error ?? '', pluginDir);
      steps.push({
        phase: 'resolve',
        pass: false,
        message: missingDep
          ? `Plugin found at ${pluginDir} but has a missing dependency: ${missingDep}`
          : `Plugin found at ${pluginDir} but failed to load: ${result.error}`,
      });
      return steps;
    }
  }

  // Try node_modules if not found in plugins folder
  if (!pluginModule) {
    const result = await tryResolve(pluginName);
    if (result.module) {
      pluginModule = result.module;
      resolvedFrom = pluginName;
      debug('resolved from node_modules: %o', pluginName);
    } else {
      const missingDep = parseMissingDependency(result.error ?? '', pluginName);
      steps.push({
        phase: 'resolve',
        pass: false,
        message: missingDep
          ? `Package "${pluginName}" found but has a missing dependency: ${missingDep}`
          : `Package "${pluginName}" not found in node_modules — try: npm install ${pluginName}`,
      });
      return steps;
    }
  }

  steps.push({
    phase: 'resolve',
    pass: true,
    message: `Module resolved from ${resolvedFrom}`,
  });

  // --- Phase 2: Export validation ---
  if (!isValidExport(pluginModule)) {
    const exportKeys = pluginModule ? Object.keys(pluginModule).join(', ') : 'none';
    steps.push({
      phase: 'export',
      pass: false,
      message: `Module does not export a function or class (default export). Exported keys: [${exportKeys}]`,
    });
    return steps;
  }

  const moduleType = isES6(pluginModule) ? 'ES6 (default export)' : 'CommonJS (factory function)';
  steps.push({
    phase: 'export',
    pass: true,
    message: `Valid ${moduleType} plugin export detected`,
  });

  // --- Phase 3: Instantiation ---
  let instance: any;
  try {
    if (isES6(pluginModule)) {
      instance = new pluginModule.default(pluginConfig, { config: pluginConfig, logger: console });
    } else {
      instance = pluginModule(pluginConfig, { config: pluginConfig, logger: console });
    }
  } catch (err: any) {
    steps.push({
      phase: 'instantiate',
      pass: false,
      message: `Plugin threw during instantiation: ${err.message}`,
    });
    return steps;
  }

  if (!instance || (typeof instance !== 'object' && typeof instance !== 'function')) {
    steps.push({
      phase: 'instantiate',
      pass: false,
      message: `Plugin constructor/factory returned ${instance === null ? 'null' : typeof instance} instead of an object`,
    });
    return steps;
  }

  steps.push({
    phase: 'instantiate',
    pass: true,
    message: 'Plugin instantiated successfully',
  });

  // --- Phase 4: Sanity check ---
  const sanityCheck = customSanityCheck ?? getSanityCheck(category);
  const passed = sanityCheck(instance);

  if (!passed) {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance) ?? {})
      .filter((m) => m !== 'constructor')
      .concat(Object.keys(instance));
    const unique = [...new Set(methods)];

    steps.push({
      phase: 'sanity-check',
      pass: false,
      message: `Plugin does not implement the required methods for category "${category}". Available methods: [${unique.join(', ')}]`,
    });
    return steps;
  }

  steps.push({
    phase: 'sanity-check',
    pass: true,
    message: `Plugin passes sanity check for category "${category}"`,
  });

  return steps;
}

/**
 * When a MODULE_NOT_FOUND error is about a transitive dependency
 * (not the plugin itself), extract the missing module name.
 */
function parseMissingDependency(message: string, pluginPath: string): string | null {
  const match = message.match(/Cannot find module '([^']+)'/);
  if (match && match[1] && !match[1].includes(pluginPath)) {
    return match[1];
  }
  return null;
}
