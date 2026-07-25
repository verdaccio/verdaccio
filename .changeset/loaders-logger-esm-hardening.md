---
'@verdaccio/loaders': patch
'@verdaccio/logger': patch
---

fix: harden plugin loading and logger for the ESM build

- loaders: use a real `createRequire` in both output formats (the ESM build
  previously relied on a throwing `require` stub, so every plugin — including
  CommonJS ones — was loaded through the `import()` fallback with interop
  differences); report `err.message` instead of the nonexistent `err.msg`;
  rethrow real plugin evaluation errors instead of retrying via `import()`
  (which ran plugin side effects twice and masked the original error); support
  ESM plugins using top-level await (`ERR_REQUIRE_ASYNC_MODULE`); resolve
  entry points for manifest-less directory plugins; use `path.isAbsolute()`
  so Windows paths convert to `file://` URLs correctly.
- logger: import `on-exit-leak-free` statically (the lazy `require` crashed
  the ESM build when `setupOnExit` ran) and make the transport directory
  detection immune to the `__dirname` global that `node -e`/REPL leak into
  ES modules.
