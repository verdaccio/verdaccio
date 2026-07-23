/**
 * Pure ESM auth plugin: `require()` returns ERR_REQUIRE_ESM; loader must use dynamic `import()`.
 * Default export must be a class (see executePlugin / isES6 in plugin-async-loader).
 */
export default class VerdaccioEsmPlugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  authenticate() {}
}
