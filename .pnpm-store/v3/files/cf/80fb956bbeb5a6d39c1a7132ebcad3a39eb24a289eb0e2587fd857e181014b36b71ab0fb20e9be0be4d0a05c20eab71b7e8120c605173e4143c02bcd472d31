'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.



































































































































































































































































































































































































































































































































































































































































recursivePatternCapture = recursivePatternCapture;var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _doctrine = require('doctrine');var _doctrine2 = _interopRequireDefault(_doctrine);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _eslint = require('eslint');var _parse = require('eslint-module-utils/parse');var _parse2 = _interopRequireDefault(_parse);var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);var _ignore = require('eslint-module-utils/ignore');var _ignore2 = _interopRequireDefault(_ignore);var _hash = require('eslint-module-utils/hash');var _unambiguous = require('eslint-module-utils/unambiguous');var unambiguous = _interopRequireWildcard(_unambiguous);var _tsconfigLoader = require('tsconfig-paths/lib/tsconfig-loader');var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}let parseConfigFileTextToJson;const log = (0, _debug2.default)('eslint-plugin-import:ExportMap');const exportCache = new Map();class ExportMap {constructor(path) {this.path = path;this.namespace = new Map(); // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new Map(); /**
                                 * star-exports
                                 * @type {Set} of () => ExportMap
                                 */this.dependencies = new Set(); /**
                                                                   * dependencies of this module that are not explicitly re-exported
                                                                   * @type {Map} from path = () => ExportMap
                                                                   */this.imports = new Map();this.errors = [];}get hasDefault() {return this.get('default') != null;} // stronger than this.has
  get size() {let size = this.namespace.size + this.reexports.size;this.dependencies.forEach(dep => {const d = dep(); // CJS / ignored dependencies won't exist (#717)
      if (d == null) return;size += d.size;});return size;} /**
                                                             * Note that this does not check explicitly re-exported names for existence
                                                             * in the base namespace, but it will expand all `export * from '...'` exports
                                                             * if not found in the explicit namespace.
                                                             * @param  {string}  name
                                                             * @return {Boolean} true if `name` is exported by this module.
                                                             */has(name) {if (this.namespace.has(name)) return true;if (this.reexports.has(name)) return true; // default exports must be explicitly re-exported (#328)
    if (name !== 'default') {for (let dep of this.dependencies) {let innerMap = dep(); // todo: report as unresolved?
        if (!innerMap) continue;if (innerMap.has(name)) return true;}}return false;} /**
                                                                                      * ensure that imported name fully resolves.
                                                                                      * @param  {[type]}  name [description]
                                                                                      * @return {Boolean}      [description]
                                                                                      */hasDeep(name) {if (this.namespace.has(name)) return { found: true, path: [this] };if (this.reexports.has(name)) {const reexports = this.reexports.get(name),imported = reexports.getImport(); // if import is ignored, return explicit 'null'
      if (imported == null) return { found: true, path: [this] // safeguard against cycles, only if name matches
      };if (imported.path === this.path && reexports.local === name) {return { found: false, path: [this] };}const deep = imported.hasDeep(reexports.local);deep.path.unshift(this);return deep;} // default exports must be explicitly re-exported (#328)
    if (name !== 'default') {for (let dep of this.dependencies) {let innerMap = dep();if (innerMap == null) return { found: true, path: [this] // todo: report as unresolved?
        };if (!innerMap) continue; // safeguard against cycles
        if (innerMap.path === this.path) continue;let innerValue = innerMap.hasDeep(name);if (innerValue.found) {innerValue.path.unshift(this);return innerValue;}}}return { found: false, path: [this] };}get(name) {if (this.namespace.has(name)) return this.namespace.get(name);if (this.reexports.has(name)) {const reexports = this.reexports.get(name),imported = reexports.getImport(); // if import is ignored, return explicit 'null'
      if (imported == null) return null; // safeguard against cycles, only if name matches
      if (imported.path === this.path && reexports.local === name) return undefined;return imported.get(reexports.local);} // default exports must be explicitly re-exported (#328)
    if (name !== 'default') {for (let dep of this.dependencies) {let innerMap = dep(); // todo: report as unresolved?
        if (!innerMap) continue; // safeguard against cycles
        if (innerMap.path === this.path) continue;let innerValue = innerMap.get(name);if (innerValue !== undefined) return innerValue;}}return undefined;}forEach(callback, thisArg) {this.namespace.forEach((v, n) => callback.call(thisArg, v, n, this));this.reexports.forEach((reexports, name) => {const reexported = reexports.getImport(); // can't look up meta for ignored re-exports (#348)
      callback.call(thisArg, reexported && reexported.get(reexports.local), name, this);});this.dependencies.forEach(dep => {const d = dep(); // CJS / ignored dependencies won't exist (#717)
      if (d == null) return;d.forEach((v, n) => n !== 'default' && callback.call(thisArg, v, n, this));});} // todo: keys, values, entries?
  reportErrors(context, declaration) {context.report({ node: declaration.source, message: `Parse errors in imported module '${declaration.source.value}': ` + `${this.errors.map(e => `${e.message} (${e.lineNumber}:${e.column})`).join(', ')}` });}}exports.default = ExportMap; /**
                                                                                                                                                                                                                                                                                    * parse docs from the first node that has leading comments
                                                                                                                                                                                                                                                                                    */function captureDoc(source, docStyleParsers) {const metadata = {}; // 'some' short-circuits on first 'true'
  for (var _len = arguments.length, nodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {nodes[_key - 2] = arguments[_key];}nodes.some(n => {try {let leadingComments; // n.leadingComments is legacy `attachComments` behavior
      if ('leadingComments' in n) {leadingComments = n.leadingComments;} else if (n.range) {leadingComments = source.getCommentsBefore(n);}if (!leadingComments || leadingComments.length === 0) return false;for (let name in docStyleParsers) {const doc = docStyleParsers[name](leadingComments);if (doc) {metadata.doc = doc;}}return true;} catch (err) {return false;}});return metadata;}const availableDocStyleParsers = { jsdoc: captureJsDoc, tomdoc: captureTomDoc /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * parse JSDoc from leading comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @param  {...[type]} comments [description]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @return {{doc: object}}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */ };function captureJsDoc(comments) {let doc; // capture XSDoc
  comments.forEach(comment => {// skip non-block comments
    if (comment.type !== 'Block') return;try {doc = _doctrine2.default.parse(comment.value, { unwrap: true });} catch (err) {/* don't care, for now? maybe add to `errors?` */}});return doc;} /**
                                                                                                                                                                                                 * parse TomDoc section from comments
                                                                                                                                                                                                 */function captureTomDoc(comments) {// collect lines up to first paragraph break
  const lines = [];for (let i = 0; i < comments.length; i++) {const comment = comments[i];if (comment.value.match(/^\s*$/)) break;lines.push(comment.value.trim());} // return doctrine-like object
  const statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);if (statusMatch) {return { description: statusMatch[2], tags: [{ title: statusMatch[1].toLowerCase(), description: statusMatch[2] }] };}}ExportMap.get = function (source, context) {const path = (0, _resolve2.default)(source, context);if (path == null) return null;return ExportMap.for(childContext(path, context));};ExportMap.for = function (context) {const path = context.path;const cacheKey = (0, _hash.hashObject)(context).digest('hex');let exportMap = exportCache.get(cacheKey); // return cached ignore
  if (exportMap === null) return null;const stats = _fs2.default.statSync(path);if (exportMap != null) {// date equality check
    if (exportMap.mtime - stats.mtime === 0) {return exportMap;} // future: check content equality?
  } // check valid extensions first
  if (!(0, _ignore.hasValidExtension)(path, context)) {exportCache.set(cacheKey, null);return null;} // check for and cache ignore
  if ((0, _ignore2.default)(path, context)) {log('ignored path due to ignore settings:', path);exportCache.set(cacheKey, null);return null;}const content = _fs2.default.readFileSync(path, { encoding: 'utf8' }); // check for and cache unambiguous modules
  if (!unambiguous.test(content)) {log('ignored path due to unambiguous regex:', path);exportCache.set(cacheKey, null);return null;}log('cache miss', cacheKey, 'for path', path);exportMap = ExportMap.parse(path, content, context); // ambiguous modules return null
  if (exportMap == null) return null;exportMap.mtime = stats.mtime;exportCache.set(cacheKey, exportMap);return exportMap;};ExportMap.parse = function (path, content, context) {var m = new ExportMap(path);try {var ast = (0, _parse2.default)(path, content, context);} catch (err) {log('parse error:', path, err);m.errors.push(err);return m; // can't continue
  }if (!unambiguous.isModule(ast)) return null;const docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];const docStyleParsers = {};docstyle.forEach(style => {docStyleParsers[style] = availableDocStyleParsers[style];}); // attempt to collect module doc
  if (ast.comments) {ast.comments.some(c => {if (c.type !== 'Block') return false;try {const doc = _doctrine2.default.parse(c.value, { unwrap: true });if (doc.tags.some(t => t.title === 'module')) {m.doc = doc;return true;}} catch (err) {/* ignore */}return false;});}const namespaces = new Map();function remotePath(value) {return _resolve2.default.relative(value, path, context.settings);}function resolveImport(value) {const rp = remotePath(value);if (rp == null) return null;return ExportMap.for(childContext(rp, context));}function getNamespace(identifier) {if (!namespaces.has(identifier.name)) return;return function () {return resolveImport(namespaces.get(identifier.name));};}function addNamespace(object, identifier) {const nsfn = getNamespace(identifier);if (nsfn) {Object.defineProperty(object, 'namespace', { get: nsfn });}return object;}function captureDependency(declaration) {if (declaration.source == null) return null;if (declaration.importKind === 'type') return null; // skip Flow type imports
    const importedSpecifiers = new Set();const supportedTypes = new Set(['ImportDefaultSpecifier', 'ImportNamespaceSpecifier']);let hasImportedType = false;if (declaration.specifiers) {declaration.specifiers.forEach(specifier => {const isType = specifier.importKind === 'type';hasImportedType = hasImportedType || isType;if (supportedTypes.has(specifier.type) && !isType) {importedSpecifiers.add(specifier.type);}if (specifier.type === 'ImportSpecifier' && !isType) {importedSpecifiers.add(specifier.imported.name);}});} // only Flow types were imported
    if (hasImportedType && importedSpecifiers.size === 0) return null;const p = remotePath(declaration.source.value);if (p == null) return null;const existing = m.imports.get(p);if (existing != null) return existing.getter;const getter = thunkFor(p, context);m.imports.set(p, { getter, source: { // capturing actual node reference holds full AST in memory!
        value: declaration.source.value, loc: declaration.source.loc }, importedSpecifiers });return getter;}const source = makeSourceCode(content, ast);function isEsModuleInterop() {const tsConfigInfo = (0, _tsconfigLoader.tsConfigLoader)({ cwd: context.parserOptions && context.parserOptions.tsconfigRootDir || process.cwd(), getEnv: key => process.env[key] });try {if (tsConfigInfo.tsConfigPath !== undefined) {const jsonText = _fs2.default.readFileSync(tsConfigInfo.tsConfigPath).toString();if (!parseConfigFileTextToJson) {var _require = require('typescript'); // this is because projects not using TypeScript won't have typescript installed
          parseConfigFileTextToJson = _require.parseConfigFileTextToJson;}const tsConfig = parseConfigFileTextToJson(tsConfigInfo.tsConfigPath, jsonText).config;return tsConfig.compilerOptions.esModuleInterop;}} catch (e) {return false;}}ast.body.forEach(function (n) {if (n.type === 'ExportDefaultDeclaration') {const exportMeta = captureDoc(source, docStyleParsers, n);if (n.declaration.type === 'Identifier') {addNamespace(exportMeta, n.declaration);}m.namespace.set('default', exportMeta);return;}if (n.type === 'ExportAllDeclaration') {const getter = captureDependency(n);if (getter) m.dependencies.add(getter);return;} // capture namespaces in case of later export
    if (n.type === 'ImportDeclaration') {captureDependency(n);let ns;if (n.specifiers.some(s => s.type === 'ImportNamespaceSpecifier' && (ns = s))) {namespaces.set(ns.local.name, n.source.value);}return;}if (n.type === 'ExportNamedDeclaration') {// capture declaration
      if (n.declaration != null) {switch (n.declaration.type) {case 'FunctionDeclaration':case 'ClassDeclaration':case 'TypeAlias': // flowtype with babel-eslint parser
          case 'InterfaceDeclaration':case 'DeclareFunction':case 'TSDeclareFunction':case 'TSEnumDeclaration':case 'TSTypeAliasDeclaration':case 'TSInterfaceDeclaration':case 'TSAbstractClassDeclaration':case 'TSModuleDeclaration':m.namespace.set(n.declaration.id.name, captureDoc(source, docStyleParsers, n));break;case 'VariableDeclaration':n.declaration.declarations.forEach(d => recursivePatternCapture(d.id, id => m.namespace.set(id.name, captureDoc(source, docStyleParsers, d, n))));break;}}const nsource = n.source && n.source.value;n.specifiers.forEach(s => {const exportMeta = {};let local;switch (s.type) {case 'ExportDefaultSpecifier':if (!n.source) return;local = 'default';break;case 'ExportNamespaceSpecifier':m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', { get() {return resolveImport(nsource);} }));return;case 'ExportSpecifier':if (!n.source) {m.namespace.set(s.exported.name, addNamespace(exportMeta, s.local));return;} // else falls through
          default:local = s.local.name;break;} // todo: JSDoc
        m.reexports.set(s.exported.name, { local, getImport: () => resolveImport(nsource) });});}const isEsModuleInteropTrue = isEsModuleInterop();const exports = ['TSExportAssignment'];if (isEsModuleInteropTrue) {exports.push('TSNamespaceExportDeclaration');} // This doesn't declare anything, but changes what's being exported.
    if ((0, _arrayIncludes2.default)(exports, n.type)) {const exportedName = n.type === 'TSNamespaceExportDeclaration' ? n.id.name : n.expression && n.expression.name || n.expression.id.name;const declTypes = ['VariableDeclaration', 'ClassDeclaration', 'TSDeclareFunction', 'TSEnumDeclaration', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSAbstractClassDeclaration', 'TSModuleDeclaration'];const exportedDecls = ast.body.filter((_ref) => {let type = _ref.type,id = _ref.id,declarations = _ref.declarations;return (0, _arrayIncludes2.default)(declTypes, type) && (id && id.name === exportedName || declarations && declarations.find(d => d.id.name === exportedName));});if (exportedDecls.length === 0) {// Export is not referencing any local declaration, must be re-exporting
        m.namespace.set('default', captureDoc(source, docStyleParsers, n));return;}if (isEsModuleInteropTrue) {m.namespace.set('default', {});}exportedDecls.forEach(decl => {if (decl.type === 'TSModuleDeclaration') {if (decl.body && decl.body.type === 'TSModuleDeclaration') {m.namespace.set(decl.body.id.name, captureDoc(source, docStyleParsers, decl.body));} else if (decl.body && decl.body.body) {decl.body.body.forEach(moduleBlockNode => {// Export-assignment exports all members in the namespace,
              // explicitly exported or not.
              const namespaceDecl = moduleBlockNode.type === 'ExportNamedDeclaration' ? moduleBlockNode.declaration : moduleBlockNode;if (!namespaceDecl) {// TypeScript can check this for us; we needn't
              } else if (namespaceDecl.type === 'VariableDeclaration') {namespaceDecl.declarations.forEach(d => recursivePatternCapture(d.id, id => m.namespace.set(id.name, captureDoc(source, docStyleParsers, decl, namespaceDecl, moduleBlockNode))));} else {m.namespace.set(namespaceDecl.id.name, captureDoc(source, docStyleParsers, moduleBlockNode));}});}} else {// Export as default
          m.namespace.set('default', captureDoc(source, docStyleParsers, decl));}});}});return m;}; /**
                                                                                                     * The creation of this closure is isolated from other scopes
                                                                                                     * to avoid over-retention of unrelated variables, which has
                                                                                                     * caused memory leaks. See #1266.
                                                                                                     */function thunkFor(p, context) {return () => ExportMap.for(childContext(p, context));} /**
                                                                                                                                                                                              * Traverse a pattern/identifier node, calling 'callback'
                                                                                                                                                                                              * for each leaf identifier.
                                                                                                                                                                                              * @param  {node}   pattern
                                                                                                                                                                                              * @param  {Function} callback
                                                                                                                                                                                              * @return {void}
                                                                                                                                                                                              */function recursivePatternCapture(pattern, callback) {switch (pattern.type) {case 'Identifier': // base case
      callback(pattern);break;case 'ObjectPattern':pattern.properties.forEach(p => {recursivePatternCapture(p.value, callback);});break;case 'ArrayPattern':pattern.elements.forEach(element => {if (element == null) return;recursivePatternCapture(element, callback);});break;case 'AssignmentPattern':callback(pattern.left);break;}} /**
                                                                                                                                                                                                                                                                                                                                           * don't hold full context object in memory, just grab what we need.
                                                                                                                                                                                                                                                                                                                                           */function childContext(path, context) {const settings = context.settings,parserOptions = context.parserOptions,parserPath = context.parserPath;return { settings, parserOptions, parserPath, path };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * sometimes legacy support isn't _that_ hard... right?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */function makeSourceCode(text, ast) {if (_eslint.SourceCode.length > 1) {// ESLint 3
    return new _eslint.SourceCode(text, ast);} else {// ESLint 4, 5
    return new _eslint.SourceCode({ text, ast });}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHBvcnRNYXAuanMiXSwibmFtZXMiOlsicmVjdXJzaXZlUGF0dGVybkNhcHR1cmUiLCJ1bmFtYmlndW91cyIsInBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb24iLCJsb2ciLCJleHBvcnRDYWNoZSIsIk1hcCIsIkV4cG9ydE1hcCIsImNvbnN0cnVjdG9yIiwicGF0aCIsIm5hbWVzcGFjZSIsInJlZXhwb3J0cyIsImRlcGVuZGVuY2llcyIsIlNldCIsImltcG9ydHMiLCJlcnJvcnMiLCJoYXNEZWZhdWx0IiwiZ2V0Iiwic2l6ZSIsImZvckVhY2giLCJkZXAiLCJkIiwiaGFzIiwibmFtZSIsImlubmVyTWFwIiwiaGFzRGVlcCIsImZvdW5kIiwiaW1wb3J0ZWQiLCJnZXRJbXBvcnQiLCJsb2NhbCIsImRlZXAiLCJ1bnNoaWZ0IiwiaW5uZXJWYWx1ZSIsInVuZGVmaW5lZCIsImNhbGxiYWNrIiwidGhpc0FyZyIsInYiLCJuIiwiY2FsbCIsInJlZXhwb3J0ZWQiLCJyZXBvcnRFcnJvcnMiLCJjb250ZXh0IiwiZGVjbGFyYXRpb24iLCJyZXBvcnQiLCJub2RlIiwic291cmNlIiwibWVzc2FnZSIsInZhbHVlIiwibWFwIiwiZSIsImxpbmVOdW1iZXIiLCJjb2x1bW4iLCJqb2luIiwiY2FwdHVyZURvYyIsImRvY1N0eWxlUGFyc2VycyIsIm1ldGFkYXRhIiwibm9kZXMiLCJzb21lIiwibGVhZGluZ0NvbW1lbnRzIiwicmFuZ2UiLCJnZXRDb21tZW50c0JlZm9yZSIsImxlbmd0aCIsImRvYyIsImVyciIsImF2YWlsYWJsZURvY1N0eWxlUGFyc2VycyIsImpzZG9jIiwiY2FwdHVyZUpzRG9jIiwidG9tZG9jIiwiY2FwdHVyZVRvbURvYyIsImNvbW1lbnRzIiwiY29tbWVudCIsInR5cGUiLCJkb2N0cmluZSIsInBhcnNlIiwidW53cmFwIiwibGluZXMiLCJpIiwibWF0Y2giLCJwdXNoIiwidHJpbSIsInN0YXR1c01hdGNoIiwiZGVzY3JpcHRpb24iLCJ0YWdzIiwidGl0bGUiLCJ0b0xvd2VyQ2FzZSIsImZvciIsImNoaWxkQ29udGV4dCIsImNhY2hlS2V5IiwiZGlnZXN0IiwiZXhwb3J0TWFwIiwic3RhdHMiLCJmcyIsInN0YXRTeW5jIiwibXRpbWUiLCJzZXQiLCJjb250ZW50IiwicmVhZEZpbGVTeW5jIiwiZW5jb2RpbmciLCJ0ZXN0IiwibSIsImFzdCIsImlzTW9kdWxlIiwiZG9jc3R5bGUiLCJzZXR0aW5ncyIsInN0eWxlIiwiYyIsInQiLCJuYW1lc3BhY2VzIiwicmVtb3RlUGF0aCIsInJlc29sdmUiLCJyZWxhdGl2ZSIsInJlc29sdmVJbXBvcnQiLCJycCIsImdldE5hbWVzcGFjZSIsImlkZW50aWZpZXIiLCJhZGROYW1lc3BhY2UiLCJvYmplY3QiLCJuc2ZuIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjYXB0dXJlRGVwZW5kZW5jeSIsImltcG9ydEtpbmQiLCJpbXBvcnRlZFNwZWNpZmllcnMiLCJzdXBwb3J0ZWRUeXBlcyIsImhhc0ltcG9ydGVkVHlwZSIsInNwZWNpZmllcnMiLCJzcGVjaWZpZXIiLCJpc1R5cGUiLCJhZGQiLCJwIiwiZXhpc3RpbmciLCJnZXR0ZXIiLCJ0aHVua0ZvciIsImxvYyIsIm1ha2VTb3VyY2VDb2RlIiwiaXNFc01vZHVsZUludGVyb3AiLCJ0c0NvbmZpZ0luZm8iLCJjd2QiLCJwYXJzZXJPcHRpb25zIiwidHNjb25maWdSb290RGlyIiwicHJvY2VzcyIsImdldEVudiIsImtleSIsImVudiIsInRzQ29uZmlnUGF0aCIsImpzb25UZXh0IiwidG9TdHJpbmciLCJyZXF1aXJlIiwidHNDb25maWciLCJjb25maWciLCJjb21waWxlck9wdGlvbnMiLCJlc01vZHVsZUludGVyb3AiLCJib2R5IiwiZXhwb3J0TWV0YSIsIm5zIiwicyIsImlkIiwiZGVjbGFyYXRpb25zIiwibnNvdXJjZSIsImV4cG9ydGVkIiwiaXNFc01vZHVsZUludGVyb3BUcnVlIiwiZXhwb3J0cyIsImV4cG9ydGVkTmFtZSIsImV4cHJlc3Npb24iLCJkZWNsVHlwZXMiLCJleHBvcnRlZERlY2xzIiwiZmlsdGVyIiwiZmluZCIsImRlY2wiLCJtb2R1bGVCbG9ja05vZGUiLCJuYW1lc3BhY2VEZWNsIiwicGF0dGVybiIsInByb3BlcnRpZXMiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJsZWZ0IiwicGFyc2VyUGF0aCIsInRleHQiLCJTb3VyY2VDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9vQmdCQSx1QixHQUFBQSx1QixDQXBvQmhCLHdCLHVDQUVBLG9DLG1EQUVBLDhCLDZDQUVBLGdDQUVBLGtELDZDQUNBLHNELGlE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UCxDQUNELENBSEQsTUFHTyxDQUNMO0FBQ0EsV0FBTyxJQUFJOEUsa0JBQUosQ0FBZSxFQUFFRCxJQUFGLEVBQVE3RSxHQUFSLEVBQWYsQ0FBUCxDQUNELENBQ0YiLCJmaWxlIjoiRXhwb3J0TWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5pbXBvcnQgZG9jdHJpbmUgZnJvbSAnZG9jdHJpbmUnXG5cbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1ZydcblxuaW1wb3J0IHsgU291cmNlQ29kZSB9IGZyb20gJ2VzbGludCdcblxuaW1wb3J0IHBhcnNlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcGFyc2UnXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnXG5pbXBvcnQgaXNJZ25vcmVkLCB7IGhhc1ZhbGlkRXh0ZW5zaW9uIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9pZ25vcmUnXG5cbmltcG9ydCB7IGhhc2hPYmplY3QgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2hhc2gnXG5pbXBvcnQgKiBhcyB1bmFtYmlndW91cyBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3VuYW1iaWd1b3VzJ1xuXG5pbXBvcnQgeyB0c0NvbmZpZ0xvYWRlciB9IGZyb20gJ3RzY29uZmlnLXBhdGhzL2xpYi90c2NvbmZpZy1sb2FkZXInXG5cbmltcG9ydCBpbmNsdWRlcyBmcm9tICdhcnJheS1pbmNsdWRlcydcblxubGV0IHBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb25cblxuY29uc3QgbG9nID0gZGVidWcoJ2VzbGludC1wbHVnaW4taW1wb3J0OkV4cG9ydE1hcCcpXG5cbmNvbnN0IGV4cG9ydENhY2hlID0gbmV3IE1hcCgpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9ydE1hcCB7XG4gIGNvbnN0cnVjdG9yKHBhdGgpIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuZXcgTWFwKClcbiAgICAvLyB0b2RvOiByZXN0cnVjdHVyZSB0byBrZXkgb24gcGF0aCwgdmFsdWUgaXMgcmVzb2x2ZXIgKyBtYXAgb2YgbmFtZXNcbiAgICB0aGlzLnJlZXhwb3J0cyA9IG5ldyBNYXAoKVxuICAgIC8qKlxuICAgICAqIHN0YXItZXhwb3J0c1xuICAgICAqIEB0eXBlIHtTZXR9IG9mICgpID0+IEV4cG9ydE1hcFxuICAgICAqL1xuICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpXG4gICAgLyoqXG4gICAgICogZGVwZW5kZW5jaWVzIG9mIHRoaXMgbW9kdWxlIHRoYXQgYXJlIG5vdCBleHBsaWNpdGx5IHJlLWV4cG9ydGVkXG4gICAgICogQHR5cGUge01hcH0gZnJvbSBwYXRoID0gKCkgPT4gRXhwb3J0TWFwXG4gICAgICovXG4gICAgdGhpcy5pbXBvcnRzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5lcnJvcnMgPSBbXVxuICB9XG5cbiAgZ2V0IGhhc0RlZmF1bHQoKSB7IHJldHVybiB0aGlzLmdldCgnZGVmYXVsdCcpICE9IG51bGwgfSAvLyBzdHJvbmdlciB0aGFuIHRoaXMuaGFzXG5cbiAgZ2V0IHNpemUoKSB7XG4gICAgbGV0IHNpemUgPSB0aGlzLm5hbWVzcGFjZS5zaXplICsgdGhpcy5yZWV4cG9ydHMuc2l6ZVxuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgIGNvbnN0IGQgPSBkZXAoKVxuICAgICAgLy8gQ0pTIC8gaWdub3JlZCBkZXBlbmRlbmNpZXMgd29uJ3QgZXhpc3QgKCM3MTcpXG4gICAgICBpZiAoZCA9PSBudWxsKSByZXR1cm5cbiAgICAgIHNpemUgKz0gZC5zaXplXG4gICAgfSlcbiAgICByZXR1cm4gc2l6ZVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdGUgdGhhdCB0aGlzIGRvZXMgbm90IGNoZWNrIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgbmFtZXMgZm9yIGV4aXN0ZW5jZVxuICAgKiBpbiB0aGUgYmFzZSBuYW1lc3BhY2UsIGJ1dCBpdCB3aWxsIGV4cGFuZCBhbGwgYGV4cG9ydCAqIGZyb20gJy4uLidgIGV4cG9ydHNcbiAgICogaWYgbm90IGZvdW5kIGluIHRoZSBleHBsaWNpdCBuYW1lc3BhY2UuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIG5hbWVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgbmFtZWAgaXMgZXhwb3J0ZWQgYnkgdGhpcyBtb2R1bGUuXG4gICAqL1xuICBoYXMobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB0cnVlXG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkgcmV0dXJuIHRydWVcblxuICAgIC8vIGRlZmF1bHQgZXhwb3J0cyBtdXN0IGJlIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgKCMzMjgpXG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZm9yIChsZXQgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGxldCBpbm5lck1hcCA9IGRlcCgpXG5cbiAgICAgICAgLy8gdG9kbzogcmVwb3J0IGFzIHVucmVzb2x2ZWQ/XG4gICAgICAgIGlmICghaW5uZXJNYXApIGNvbnRpbnVlXG5cbiAgICAgICAgaWYgKGlubmVyTWFwLmhhcyhuYW1lKSkgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBlbnN1cmUgdGhhdCBpbXBvcnRlZCBuYW1lIGZ1bGx5IHJlc29sdmVzLlxuICAgKiBAcGFyYW0gIHtbdHlwZV19ICBuYW1lIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBoYXNEZWVwKG5hbWUpIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UuaGFzKG5hbWUpKSByZXR1cm4geyBmb3VuZDogdHJ1ZSwgcGF0aDogW3RoaXNdIH1cblxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRzLmdldChuYW1lKVxuICAgICAgICAgICwgaW1wb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KClcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4geyBmb3VuZDogdHJ1ZSwgcGF0aDogW3RoaXNdIH1cblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBkZWVwID0gaW1wb3J0ZWQuaGFzRGVlcChyZWV4cG9ydHMubG9jYWwpXG4gICAgICBkZWVwLnBhdGgudW5zaGlmdCh0aGlzKVxuXG4gICAgICByZXR1cm4gZGVlcFxuICAgIH1cblxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBmb3IgKGxldCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgbGV0IGlubmVyTWFwID0gZGVwKClcbiAgICAgICAgaWYgKGlubmVyTWFwID09IG51bGwpIHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfVxuICAgICAgICAvLyB0b2RvOiByZXBvcnQgYXMgdW5yZXNvbHZlZD9cbiAgICAgICAgaWYgKCFpbm5lck1hcCkgY29udGludWVcblxuICAgICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXNcbiAgICAgICAgaWYgKGlubmVyTWFwLnBhdGggPT09IHRoaXMucGF0aCkgY29udGludWVcblxuICAgICAgICBsZXQgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmhhc0RlZXAobmFtZSlcbiAgICAgICAgaWYgKGlubmVyVmFsdWUuZm91bmQpIHtcbiAgICAgICAgICBpbm5lclZhbHVlLnBhdGgudW5zaGlmdCh0aGlzKVxuICAgICAgICAgIHJldHVybiBpbm5lclZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBmb3VuZDogZmFsc2UsIHBhdGg6IFt0aGlzXSB9XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmICh0aGlzLm5hbWVzcGFjZS5oYXMobmFtZSkpIHJldHVybiB0aGlzLm5hbWVzcGFjZS5nZXQobmFtZSlcblxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRzLmdldChuYW1lKVxuICAgICAgICAgICwgaW1wb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KClcblxuICAgICAgLy8gaWYgaW1wb3J0IGlzIGlnbm9yZWQsIHJldHVybiBleHBsaWNpdCAnbnVsbCdcbiAgICAgIGlmIChpbXBvcnRlZCA9PSBudWxsKSByZXR1cm4gbnVsbFxuXG4gICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXMsIG9ubHkgaWYgbmFtZSBtYXRjaGVzXG4gICAgICBpZiAoaW1wb3J0ZWQucGF0aCA9PT0gdGhpcy5wYXRoICYmIHJlZXhwb3J0cy5sb2NhbCA9PT0gbmFtZSkgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICByZXR1cm4gaW1wb3J0ZWQuZ2V0KHJlZXhwb3J0cy5sb2NhbClcbiAgICB9XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAobGV0IGRlcCBvZiB0aGlzLmRlcGVuZGVuY2llcykge1xuICAgICAgICBsZXQgaW5uZXJNYXAgPSBkZXAoKVxuICAgICAgICAvLyB0b2RvOiByZXBvcnQgYXMgdW5yZXNvbHZlZD9cbiAgICAgICAgaWYgKCFpbm5lck1hcCkgY29udGludWVcblxuICAgICAgICAvLyBzYWZlZ3VhcmQgYWdhaW5zdCBjeWNsZXNcbiAgICAgICAgaWYgKGlubmVyTWFwLnBhdGggPT09IHRoaXMucGF0aCkgY29udGludWVcblxuICAgICAgICBsZXQgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmdldChuYW1lKVxuICAgICAgICBpZiAoaW5uZXJWYWx1ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gaW5uZXJWYWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB0aGlzLm5hbWVzcGFjZS5mb3JFYWNoKCh2LCBuKSA9PlxuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBuLCB0aGlzKSlcblxuICAgIHRoaXMucmVleHBvcnRzLmZvckVhY2goKHJlZXhwb3J0cywgbmFtZSkgPT4ge1xuICAgICAgY29uc3QgcmVleHBvcnRlZCA9IHJlZXhwb3J0cy5nZXRJbXBvcnQoKVxuICAgICAgLy8gY2FuJ3QgbG9vayB1cCBtZXRhIGZvciBpZ25vcmVkIHJlLWV4cG9ydHMgKCMzNDgpXG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHJlZXhwb3J0ZWQgJiYgcmVleHBvcnRlZC5nZXQocmVleHBvcnRzLmxvY2FsKSwgbmFtZSwgdGhpcylcbiAgICB9KVxuXG4gICAgdGhpcy5kZXBlbmRlbmNpZXMuZm9yRWFjaChkZXAgPT4ge1xuICAgICAgY29uc3QgZCA9IGRlcCgpXG4gICAgICAvLyBDSlMgLyBpZ25vcmVkIGRlcGVuZGVuY2llcyB3b24ndCBleGlzdCAoIzcxNylcbiAgICAgIGlmIChkID09IG51bGwpIHJldHVyblxuXG4gICAgICBkLmZvckVhY2goKHYsIG4pID0+XG4gICAgICAgIG4gIT09ICdkZWZhdWx0JyAmJiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHYsIG4sIHRoaXMpKVxuICAgIH0pXG4gIH1cblxuICAvLyB0b2RvOiBrZXlzLCB2YWx1ZXMsIGVudHJpZXM/XG5cbiAgcmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKSB7XG4gICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgbm9kZTogZGVjbGFyYXRpb24uc291cmNlLFxuICAgICAgbWVzc2FnZTogYFBhcnNlIGVycm9ycyBpbiBpbXBvcnRlZCBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfSc6IGAgK1xuICAgICAgICAgICAgICAgICAgYCR7dGhpcy5lcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBgJHtlLm1lc3NhZ2V9ICgke2UubGluZU51bWJlcn06JHtlLmNvbHVtbn0pYClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpfWAsXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlIGRvY3MgZnJvbSB0aGUgZmlyc3Qgbm9kZSB0aGF0IGhhcyBsZWFkaW5nIGNvbW1lbnRzXG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIC4uLm5vZGVzKSB7XG4gIGNvbnN0IG1ldGFkYXRhID0ge31cblxuICAvLyAnc29tZScgc2hvcnQtY2lyY3VpdHMgb24gZmlyc3QgJ3RydWUnXG4gIG5vZGVzLnNvbWUobiA9PiB7XG4gICAgdHJ5IHtcblxuICAgICAgbGV0IGxlYWRpbmdDb21tZW50c1xuXG4gICAgICAvLyBuLmxlYWRpbmdDb21tZW50cyBpcyBsZWdhY3kgYGF0dGFjaENvbW1lbnRzYCBiZWhhdmlvclxuICAgICAgaWYgKCdsZWFkaW5nQ29tbWVudHMnIGluIG4pIHtcbiAgICAgICAgbGVhZGluZ0NvbW1lbnRzID0gbi5sZWFkaW5nQ29tbWVudHNcbiAgICAgIH0gZWxzZSBpZiAobi5yYW5nZSkge1xuICAgICAgICBsZWFkaW5nQ29tbWVudHMgPSBzb3VyY2UuZ2V0Q29tbWVudHNCZWZvcmUobilcbiAgICAgIH1cblxuICAgICAgaWYgKCFsZWFkaW5nQ29tbWVudHMgfHwgbGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGZvciAobGV0IG5hbWUgaW4gZG9jU3R5bGVQYXJzZXJzKSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY1N0eWxlUGFyc2Vyc1tuYW1lXShsZWFkaW5nQ29tbWVudHMpXG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICBtZXRhZGF0YS5kb2MgPSBkb2NcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBtZXRhZGF0YVxufVxuXG5jb25zdCBhdmFpbGFibGVEb2NTdHlsZVBhcnNlcnMgPSB7XG4gIGpzZG9jOiBjYXB0dXJlSnNEb2MsXG4gIHRvbWRvYzogY2FwdHVyZVRvbURvYyxcbn1cblxuLyoqXG4gKiBwYXJzZSBKU0RvYyBmcm9tIGxlYWRpbmcgY29tbWVudHNcbiAqIEBwYXJhbSAgey4uLlt0eXBlXX0gY29tbWVudHMgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7e2RvYzogb2JqZWN0fX1cbiAqL1xuZnVuY3Rpb24gY2FwdHVyZUpzRG9jKGNvbW1lbnRzKSB7XG4gIGxldCBkb2NcblxuICAvLyBjYXB0dXJlIFhTRG9jXG4gIGNvbW1lbnRzLmZvckVhY2goY29tbWVudCA9PiB7XG4gICAgLy8gc2tpcCBub24tYmxvY2sgY29tbWVudHNcbiAgICBpZiAoY29tbWVudC50eXBlICE9PSAnQmxvY2snKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgZG9jID0gZG9jdHJpbmUucGFyc2UoY29tbWVudC52YWx1ZSwgeyB1bndyYXA6IHRydWUgfSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8qIGRvbid0IGNhcmUsIGZvciBub3c/IG1heWJlIGFkZCB0byBgZXJyb3JzP2AgKi9cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGRvY1xufVxuXG4vKipcbiAgKiBwYXJzZSBUb21Eb2Mgc2VjdGlvbiBmcm9tIGNvbW1lbnRzXG4gICovXG5mdW5jdGlvbiBjYXB0dXJlVG9tRG9jKGNvbW1lbnRzKSB7XG4gIC8vIGNvbGxlY3QgbGluZXMgdXAgdG8gZmlyc3QgcGFyYWdyYXBoIGJyZWFrXG4gIGNvbnN0IGxpbmVzID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNvbW1lbnQgPSBjb21tZW50c1tpXVxuICAgIGlmIChjb21tZW50LnZhbHVlLm1hdGNoKC9eXFxzKiQvKSkgYnJlYWtcbiAgICBsaW5lcy5wdXNoKGNvbW1lbnQudmFsdWUudHJpbSgpKVxuICB9XG5cbiAgLy8gcmV0dXJuIGRvY3RyaW5lLWxpa2Ugb2JqZWN0XG4gIGNvbnN0IHN0YXR1c01hdGNoID0gbGluZXMuam9pbignICcpLm1hdGNoKC9eKFB1YmxpY3xJbnRlcm5hbHxEZXByZWNhdGVkKTpcXHMqKC4rKS8pXG4gIGlmIChzdGF0dXNNYXRjaCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNjcmlwdGlvbjogc3RhdHVzTWF0Y2hbMl0sXG4gICAgICB0YWdzOiBbe1xuICAgICAgICB0aXRsZTogc3RhdHVzTWF0Y2hbMV0udG9Mb3dlckNhc2UoKSxcbiAgICAgICAgZGVzY3JpcHRpb246IHN0YXR1c01hdGNoWzJdLFxuICAgICAgfV0sXG4gICAgfVxuICB9XG59XG5cbkV4cG9ydE1hcC5nZXQgPSBmdW5jdGlvbiAoc291cmNlLCBjb250ZXh0KSB7XG4gIGNvbnN0IHBhdGggPSByZXNvbHZlKHNvdXJjZSwgY29udGV4dClcbiAgaWYgKHBhdGggPT0gbnVsbCkgcmV0dXJuIG51bGxcblxuICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocGF0aCwgY29udGV4dCkpXG59XG5cbkV4cG9ydE1hcC5mb3IgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICBjb25zdCB7IHBhdGggfSA9IGNvbnRleHRcblxuICBjb25zdCBjYWNoZUtleSA9IGhhc2hPYmplY3QoY29udGV4dCkuZGlnZXN0KCdoZXgnKVxuICBsZXQgZXhwb3J0TWFwID0gZXhwb3J0Q2FjaGUuZ2V0KGNhY2hlS2V5KVxuXG4gIC8vIHJldHVybiBjYWNoZWQgaWdub3JlXG4gIGlmIChleHBvcnRNYXAgPT09IG51bGwpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhwYXRoKVxuICBpZiAoZXhwb3J0TWFwICE9IG51bGwpIHtcbiAgICAvLyBkYXRlIGVxdWFsaXR5IGNoZWNrXG4gICAgaWYgKGV4cG9ydE1hcC5tdGltZSAtIHN0YXRzLm10aW1lID09PSAwKSB7XG4gICAgICByZXR1cm4gZXhwb3J0TWFwXG4gICAgfVxuICAgIC8vIGZ1dHVyZTogY2hlY2sgY29udGVudCBlcXVhbGl0eT9cbiAgfVxuXG4gIC8vIGNoZWNrIHZhbGlkIGV4dGVuc2lvbnMgZmlyc3RcbiAgaWYgKCFoYXNWYWxpZEV4dGVuc2lvbihwYXRoLCBjb250ZXh0KSkge1xuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbClcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy8gY2hlY2sgZm9yIGFuZCBjYWNoZSBpZ25vcmVcbiAgaWYgKGlzSWdub3JlZChwYXRoLCBjb250ZXh0KSkge1xuICAgIGxvZygnaWdub3JlZCBwYXRoIGR1ZSB0byBpZ25vcmUgc2V0dGluZ3M6JywgcGF0aClcbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pXG5cbiAgLy8gY2hlY2sgZm9yIGFuZCBjYWNoZSB1bmFtYmlndW91cyBtb2R1bGVzXG4gIGlmICghdW5hbWJpZ3VvdXMudGVzdChjb250ZW50KSkge1xuICAgIGxvZygnaWdub3JlZCBwYXRoIGR1ZSB0byB1bmFtYmlndW91cyByZWdleDonLCBwYXRoKVxuICAgIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgbnVsbClcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgbG9nKCdjYWNoZSBtaXNzJywgY2FjaGVLZXksICdmb3IgcGF0aCcsIHBhdGgpXG4gIGV4cG9ydE1hcCA9IEV4cG9ydE1hcC5wYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KVxuXG4gIC8vIGFtYmlndW91cyBtb2R1bGVzIHJldHVybiBudWxsXG4gIGlmIChleHBvcnRNYXAgPT0gbnVsbCkgcmV0dXJuIG51bGxcblxuICBleHBvcnRNYXAubXRpbWUgPSBzdGF0cy5tdGltZVxuXG4gIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgZXhwb3J0TWFwKVxuICByZXR1cm4gZXhwb3J0TWFwXG59XG5cblxuRXhwb3J0TWFwLnBhcnNlID0gZnVuY3Rpb24gKHBhdGgsIGNvbnRlbnQsIGNvbnRleHQpIHtcbiAgdmFyIG0gPSBuZXcgRXhwb3J0TWFwKHBhdGgpXG5cbiAgdHJ5IHtcbiAgICB2YXIgYXN0ID0gcGFyc2UocGF0aCwgY29udGVudCwgY29udGV4dClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nKCdwYXJzZSBlcnJvcjonLCBwYXRoLCBlcnIpXG4gICAgbS5lcnJvcnMucHVzaChlcnIpXG4gICAgcmV0dXJuIG0gLy8gY2FuJ3QgY29udGludWVcbiAgfVxuXG4gIGlmICghdW5hbWJpZ3VvdXMuaXNNb2R1bGUoYXN0KSkgcmV0dXJuIG51bGxcblxuICBjb25zdCBkb2NzdHlsZSA9IChjb250ZXh0LnNldHRpbmdzICYmIGNvbnRleHQuc2V0dGluZ3NbJ2ltcG9ydC9kb2NzdHlsZSddKSB8fCBbJ2pzZG9jJ11cbiAgY29uc3QgZG9jU3R5bGVQYXJzZXJzID0ge31cbiAgZG9jc3R5bGUuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgZG9jU3R5bGVQYXJzZXJzW3N0eWxlXSA9IGF2YWlsYWJsZURvY1N0eWxlUGFyc2Vyc1tzdHlsZV1cbiAgfSlcblxuICAvLyBhdHRlbXB0IHRvIGNvbGxlY3QgbW9kdWxlIGRvY1xuICBpZiAoYXN0LmNvbW1lbnRzKSB7XG4gICAgYXN0LmNvbW1lbnRzLnNvbWUoYyA9PiB7XG4gICAgICBpZiAoYy50eXBlICE9PSAnQmxvY2snKSByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY3RyaW5lLnBhcnNlKGMudmFsdWUsIHsgdW53cmFwOiB0cnVlIH0pXG4gICAgICAgIGlmIChkb2MudGFncy5zb21lKHQgPT4gdC50aXRsZSA9PT0gJ21vZHVsZScpKSB7XG4gICAgICAgICAgbS5kb2MgPSBkb2NcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHsgLyogaWdub3JlICovIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBuYW1lc3BhY2VzID0gbmV3IE1hcCgpXG5cbiAgZnVuY3Rpb24gcmVtb3RlUGF0aCh2YWx1ZSkge1xuICAgIHJldHVybiByZXNvbHZlLnJlbGF0aXZlKHZhbHVlLCBwYXRoLCBjb250ZXh0LnNldHRpbmdzKVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUltcG9ydCh2YWx1ZSkge1xuICAgIGNvbnN0IHJwID0gcmVtb3RlUGF0aCh2YWx1ZSlcbiAgICBpZiAocnAgPT0gbnVsbCkgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocnAsIGNvbnRleHQpKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmFtZXNwYWNlKGlkZW50aWZpZXIpIHtcbiAgICBpZiAoIW5hbWVzcGFjZXMuaGFzKGlkZW50aWZpZXIubmFtZSkpIHJldHVyblxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlSW1wb3J0KG5hbWVzcGFjZXMuZ2V0KGlkZW50aWZpZXIubmFtZSkpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkTmFtZXNwYWNlKG9iamVjdCwgaWRlbnRpZmllcikge1xuICAgIGNvbnN0IG5zZm4gPSBnZXROYW1lc3BhY2UoaWRlbnRpZmllcilcbiAgICBpZiAobnNmbikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ25hbWVzcGFjZScsIHsgZ2V0OiBuc2ZuIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFxuICB9XG5cbiAgZnVuY3Rpb24gY2FwdHVyZURlcGVuZGVuY3koZGVjbGFyYXRpb24pIHtcbiAgICBpZiAoZGVjbGFyYXRpb24uc291cmNlID09IG51bGwpIHJldHVybiBudWxsXG4gICAgaWYgKGRlY2xhcmF0aW9uLmltcG9ydEtpbmQgPT09ICd0eXBlJykgcmV0dXJuIG51bGwgLy8gc2tpcCBGbG93IHR5cGUgaW1wb3J0c1xuICAgIGNvbnN0IGltcG9ydGVkU3BlY2lmaWVycyA9IG5ldyBTZXQoKVxuICAgIGNvbnN0IHN1cHBvcnRlZFR5cGVzID0gbmV3IFNldChbJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInLCAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJ10pXG4gICAgbGV0IGhhc0ltcG9ydGVkVHlwZSA9IGZhbHNlXG4gICAgaWYgKGRlY2xhcmF0aW9uLnNwZWNpZmllcnMpIHtcbiAgICAgIGRlY2xhcmF0aW9uLnNwZWNpZmllcnMuZm9yRWFjaChzcGVjaWZpZXIgPT4ge1xuICAgICAgICBjb25zdCBpc1R5cGUgPSBzcGVjaWZpZXIuaW1wb3J0S2luZCA9PT0gJ3R5cGUnXG4gICAgICAgIGhhc0ltcG9ydGVkVHlwZSA9IGhhc0ltcG9ydGVkVHlwZSB8fCBpc1R5cGVcblxuICAgICAgICBpZiAoc3VwcG9ydGVkVHlwZXMuaGFzKHNwZWNpZmllci50eXBlKSAmJiAhaXNUeXBlKSB7XG4gICAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmFkZChzcGVjaWZpZXIudHlwZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnRTcGVjaWZpZXInICYmICFpc1R5cGUpIHtcbiAgICAgICAgICBpbXBvcnRlZFNwZWNpZmllcnMuYWRkKHNwZWNpZmllci5pbXBvcnRlZC5uYW1lKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIG9ubHkgRmxvdyB0eXBlcyB3ZXJlIGltcG9ydGVkXG4gICAgaWYgKGhhc0ltcG9ydGVkVHlwZSAmJiBpbXBvcnRlZFNwZWNpZmllcnMuc2l6ZSA9PT0gMCkgcmV0dXJuIG51bGxcblxuICAgIGNvbnN0IHAgPSByZW1vdGVQYXRoKGRlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZSlcbiAgICBpZiAocCA9PSBudWxsKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IGV4aXN0aW5nID0gbS5pbXBvcnRzLmdldChwKVxuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSByZXR1cm4gZXhpc3RpbmcuZ2V0dGVyXG5cbiAgICBjb25zdCBnZXR0ZXIgPSB0aHVua0ZvcihwLCBjb250ZXh0KVxuICAgIG0uaW1wb3J0cy5zZXQocCwge1xuICAgICAgZ2V0dGVyLFxuICAgICAgc291cmNlOiB7ICAvLyBjYXB0dXJpbmcgYWN0dWFsIG5vZGUgcmVmZXJlbmNlIGhvbGRzIGZ1bGwgQVNUIGluIG1lbW9yeSFcbiAgICAgICAgdmFsdWU6IGRlY2xhcmF0aW9uLnNvdXJjZS52YWx1ZSxcbiAgICAgICAgbG9jOiBkZWNsYXJhdGlvbi5zb3VyY2UubG9jLFxuICAgICAgfSxcbiAgICAgIGltcG9ydGVkU3BlY2lmaWVycyxcbiAgICB9KVxuICAgIHJldHVybiBnZXR0ZXJcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZSA9IG1ha2VTb3VyY2VDb2RlKGNvbnRlbnQsIGFzdClcblxuICBmdW5jdGlvbiBpc0VzTW9kdWxlSW50ZXJvcCgpIHtcbiAgICBjb25zdCB0c0NvbmZpZ0luZm8gPSB0c0NvbmZpZ0xvYWRlcih7XG4gICAgICBjd2Q6IGNvbnRleHQucGFyc2VyT3B0aW9ucyAmJiBjb250ZXh0LnBhcnNlck9wdGlvbnMudHNjb25maWdSb290RGlyIHx8IHByb2Nlc3MuY3dkKCksXG4gICAgICBnZXRFbnY6IChrZXkpID0+IHByb2Nlc3MuZW52W2tleV0sXG4gICAgfSlcbiAgICB0cnkge1xuICAgICAgaWYgKHRzQ29uZmlnSW5mby50c0NvbmZpZ1BhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBqc29uVGV4dCA9IGZzLnJlYWRGaWxlU3luYyh0c0NvbmZpZ0luZm8udHNDb25maWdQYXRoKS50b1N0cmluZygpXG4gICAgICAgIGlmICghcGFyc2VDb25maWdGaWxlVGV4dFRvSnNvbikge1xuICAgICAgICAgIC8vIHRoaXMgaXMgYmVjYXVzZSBwcm9qZWN0cyBub3QgdXNpbmcgVHlwZVNjcmlwdCB3b24ndCBoYXZlIHR5cGVzY3JpcHQgaW5zdGFsbGVkXG4gICAgICAgICAgKHtwYXJzZUNvbmZpZ0ZpbGVUZXh0VG9Kc29ufSA9IHJlcXVpcmUoJ3R5cGVzY3JpcHQnKSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0c0NvbmZpZyA9IHBhcnNlQ29uZmlnRmlsZVRleHRUb0pzb24odHNDb25maWdJbmZvLnRzQ29uZmlnUGF0aCwganNvblRleHQpLmNvbmZpZ1xuICAgICAgICByZXR1cm4gdHNDb25maWcuY29tcGlsZXJPcHRpb25zLmVzTW9kdWxlSW50ZXJvcFxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGFzdC5ib2R5LmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJykge1xuICAgICAgY29uc3QgZXhwb3J0TWV0YSA9IGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG4pXG4gICAgICBpZiAobi5kZWNsYXJhdGlvbi50eXBlID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgYWRkTmFtZXNwYWNlKGV4cG9ydE1ldGEsIG4uZGVjbGFyYXRpb24pXG4gICAgICB9XG4gICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBleHBvcnRNZXRhKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydEFsbERlY2xhcmF0aW9uJykge1xuICAgICAgY29uc3QgZ2V0dGVyID0gY2FwdHVyZURlcGVuZGVuY3kobilcbiAgICAgIGlmIChnZXR0ZXIpIG0uZGVwZW5kZW5jaWVzLmFkZChnZXR0ZXIpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBjYXB0dXJlIG5hbWVzcGFjZXMgaW4gY2FzZSBvZiBsYXRlciBleHBvcnRcbiAgICBpZiAobi50eXBlID09PSAnSW1wb3J0RGVjbGFyYXRpb24nKSB7XG4gICAgICBjYXB0dXJlRGVwZW5kZW5jeShuKVxuICAgICAgbGV0IG5zXG4gICAgICBpZiAobi5zcGVjaWZpZXJzLnNvbWUocyA9PiBzLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInICYmIChucyA9IHMpKSkge1xuICAgICAgICBuYW1lc3BhY2VzLnNldChucy5sb2NhbC5uYW1lLCBuLnNvdXJjZS52YWx1ZSlcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChuLnR5cGUgPT09ICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJykge1xuICAgICAgLy8gY2FwdHVyZSBkZWNsYXJhdGlvblxuICAgICAgaWYgKG4uZGVjbGFyYXRpb24gIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKG4uZGVjbGFyYXRpb24udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ0Z1bmN0aW9uRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ0NsYXNzRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1R5cGVBbGlhcyc6IC8vIGZsb3d0eXBlIHdpdGggYmFiZWwtZXNsaW50IHBhcnNlclxuICAgICAgICAgIGNhc2UgJ0ludGVyZmFjZURlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdEZWNsYXJlRnVuY3Rpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTRGVjbGFyZUZ1bmN0aW9uJzpcbiAgICAgICAgICBjYXNlICdUU0VudW1EZWNsYXJhdGlvbic6XG4gICAgICAgICAgY2FzZSAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbic6XG4gICAgICAgICAgY2FzZSAnVFNJbnRlcmZhY2VEZWNsYXJhdGlvbic6XG4gICAgICAgICAgY2FzZSAnVFNBYnN0cmFjdENsYXNzRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTTW9kdWxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KG4uZGVjbGFyYXRpb24uaWQubmFtZSwgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgbikpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgICAgbi5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT5cbiAgICAgICAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZC5pZCxcbiAgICAgICAgICAgICAgICBpZCA9PiBtLm5hbWVzcGFjZS5zZXQoaWQubmFtZSwgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgZCwgbikpKSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbnNvdXJjZSA9IG4uc291cmNlICYmIG4uc291cmNlLnZhbHVlXG4gICAgICBuLnNwZWNpZmllcnMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBjb25zdCBleHBvcnRNZXRhID0ge31cbiAgICAgICAgbGV0IGxvY2FsXG5cbiAgICAgICAgc3dpdGNoIChzLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdFeHBvcnREZWZhdWx0U3BlY2lmaWVyJzpcbiAgICAgICAgICAgIGlmICghbi5zb3VyY2UpIHJldHVyblxuICAgICAgICAgICAgbG9jYWwgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnRXhwb3J0TmFtZXNwYWNlU3BlY2lmaWVyJzpcbiAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChzLmV4cG9ydGVkLm5hbWUsIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRNZXRhLCAnbmFtZXNwYWNlJywge1xuICAgICAgICAgICAgICBnZXQoKSB7IHJldHVybiByZXNvbHZlSW1wb3J0KG5zb3VyY2UpIH0sXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIGNhc2UgJ0V4cG9ydFNwZWNpZmllcic6XG4gICAgICAgICAgICBpZiAoIW4uc291cmNlKSB7XG4gICAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChzLmV4cG9ydGVkLm5hbWUsIGFkZE5hbWVzcGFjZShleHBvcnRNZXRhLCBzLmxvY2FsKSlcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIGZhbGxzIHRocm91Z2hcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbG9jYWwgPSBzLmxvY2FsLm5hbWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2RvOiBKU0RvY1xuICAgICAgICBtLnJlZXhwb3J0cy5zZXQocy5leHBvcnRlZC5uYW1lLCB7IGxvY2FsLCBnZXRJbXBvcnQ6ICgpID0+IHJlc29sdmVJbXBvcnQobnNvdXJjZSkgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgaXNFc01vZHVsZUludGVyb3BUcnVlID0gaXNFc01vZHVsZUludGVyb3AoKVxuXG4gICAgY29uc3QgZXhwb3J0cyA9IFsnVFNFeHBvcnRBc3NpZ25tZW50J11cbiAgICBpZiAoaXNFc01vZHVsZUludGVyb3BUcnVlKSB7XG4gICAgICBleHBvcnRzLnB1c2goJ1RTTmFtZXNwYWNlRXhwb3J0RGVjbGFyYXRpb24nKVxuICAgIH1cblxuICAgIC8vIFRoaXMgZG9lc24ndCBkZWNsYXJlIGFueXRoaW5nLCBidXQgY2hhbmdlcyB3aGF0J3MgYmVpbmcgZXhwb3J0ZWQuXG4gICAgaWYgKGluY2x1ZGVzKGV4cG9ydHMsIG4udHlwZSkpIHtcbiAgICAgIGNvbnN0IGV4cG9ydGVkTmFtZSA9IG4udHlwZSA9PT0gJ1RTTmFtZXNwYWNlRXhwb3J0RGVjbGFyYXRpb24nXG4gICAgICAgID8gbi5pZC5uYW1lXG4gICAgICAgIDogbi5leHByZXNzaW9uICYmIG4uZXhwcmVzc2lvbi5uYW1lIHx8IG4uZXhwcmVzc2lvbi5pZC5uYW1lXG4gICAgICBjb25zdCBkZWNsVHlwZXMgPSBbXG4gICAgICAgICdWYXJpYWJsZURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ0NsYXNzRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNEZWNsYXJlRnVuY3Rpb24nLFxuICAgICAgICAnVFNFbnVtRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbicsXG4gICAgICAgICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTQWJzdHJhY3RDbGFzc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTTW9kdWxlRGVjbGFyYXRpb24nLFxuICAgICAgXVxuICAgICAgY29uc3QgZXhwb3J0ZWREZWNscyA9IGFzdC5ib2R5LmZpbHRlcigoeyB0eXBlLCBpZCwgZGVjbGFyYXRpb25zIH0pID0+IGluY2x1ZGVzKGRlY2xUeXBlcywgdHlwZSkgJiYgKFxuICAgICAgICAoaWQgJiYgaWQubmFtZSA9PT0gZXhwb3J0ZWROYW1lKSB8fCAoZGVjbGFyYXRpb25zICYmIGRlY2xhcmF0aW9ucy5maW5kKChkKSA9PiBkLmlkLm5hbWUgPT09IGV4cG9ydGVkTmFtZSkpXG4gICAgICApKVxuICAgICAgaWYgKGV4cG9ydGVkRGVjbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEV4cG9ydCBpcyBub3QgcmVmZXJlbmNpbmcgYW55IGxvY2FsIGRlY2xhcmF0aW9uLCBtdXN0IGJlIHJlLWV4cG9ydGluZ1xuICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoaXNFc01vZHVsZUludGVyb3BUcnVlKSB7XG4gICAgICAgIG0ubmFtZXNwYWNlLnNldCgnZGVmYXVsdCcsIHt9KVxuICAgICAgfVxuICAgICAgZXhwb3J0ZWREZWNscy5mb3JFYWNoKChkZWNsKSA9PiB7XG4gICAgICAgIGlmIChkZWNsLnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGlmIChkZWNsLmJvZHkgJiYgZGVjbC5ib2R5LnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KGRlY2wuYm9keS5pZC5uYW1lLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsLmJvZHkpKVxuICAgICAgICAgIH0gZWxzZSBpZiAoZGVjbC5ib2R5ICYmIGRlY2wuYm9keS5ib2R5KSB7XG4gICAgICAgICAgICBkZWNsLmJvZHkuYm9keS5mb3JFYWNoKChtb2R1bGVCbG9ja05vZGUpID0+IHtcbiAgICAgICAgICAgICAgLy8gRXhwb3J0LWFzc2lnbm1lbnQgZXhwb3J0cyBhbGwgbWVtYmVycyBpbiB0aGUgbmFtZXNwYWNlLFxuICAgICAgICAgICAgICAvLyBleHBsaWNpdGx5IGV4cG9ydGVkIG9yIG5vdC5cbiAgICAgICAgICAgICAgY29uc3QgbmFtZXNwYWNlRGVjbCA9IG1vZHVsZUJsb2NrTm9kZS50eXBlID09PSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicgP1xuICAgICAgICAgICAgICAgIG1vZHVsZUJsb2NrTm9kZS5kZWNsYXJhdGlvbiA6XG4gICAgICAgICAgICAgICAgbW9kdWxlQmxvY2tOb2RlXG5cbiAgICAgICAgICAgICAgaWYgKCFuYW1lc3BhY2VEZWNsKSB7XG4gICAgICAgICAgICAgICAgLy8gVHlwZVNjcmlwdCBjYW4gY2hlY2sgdGhpcyBmb3IgdXM7IHdlIG5lZWRuJ3RcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lc3BhY2VEZWNsLnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgICAgIG5hbWVzcGFjZURlY2wuZGVjbGFyYXRpb25zLmZvckVhY2goKGQpID0+XG4gICAgICAgICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShkLmlkLCAoaWQpID0+IG0ubmFtZXNwYWNlLnNldChcbiAgICAgICAgICAgICAgICAgICAgaWQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgZGVjbCwgbmFtZXNwYWNlRGVjbCwgbW9kdWxlQmxvY2tOb2RlKVxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KFxuICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlRGVjbC5pZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgbW9kdWxlQmxvY2tOb2RlKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwb3J0IGFzIGRlZmF1bHRcbiAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIG1cbn1cblxuLyoqXG4gKiBUaGUgY3JlYXRpb24gb2YgdGhpcyBjbG9zdXJlIGlzIGlzb2xhdGVkIGZyb20gb3RoZXIgc2NvcGVzXG4gKiB0byBhdm9pZCBvdmVyLXJldGVudGlvbiBvZiB1bnJlbGF0ZWQgdmFyaWFibGVzLCB3aGljaCBoYXNcbiAqIGNhdXNlZCBtZW1vcnkgbGVha3MuIFNlZSAjMTI2Ni5cbiAqL1xuZnVuY3Rpb24gdGh1bmtGb3IocCwgY29udGV4dCkge1xuICByZXR1cm4gKCkgPT4gRXhwb3J0TWFwLmZvcihjaGlsZENvbnRleHQocCwgY29udGV4dCkpXG59XG5cblxuLyoqXG4gKiBUcmF2ZXJzZSBhIHBhdHRlcm4vaWRlbnRpZmllciBub2RlLCBjYWxsaW5nICdjYWxsYmFjaydcbiAqIGZvciBlYWNoIGxlYWYgaWRlbnRpZmllci5cbiAqIEBwYXJhbSAge25vZGV9ICAgcGF0dGVyblxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUocGF0dGVybiwgY2FsbGJhY2spIHtcbiAgc3dpdGNoIChwYXR0ZXJuLnR5cGUpIHtcbiAgICBjYXNlICdJZGVudGlmaWVyJzogLy8gYmFzZSBjYXNlXG4gICAgICBjYWxsYmFjayhwYXR0ZXJuKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2UgJ09iamVjdFBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5wcm9wZXJ0aWVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHAudmFsdWUsIGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlICdBcnJheVBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHJldHVyblxuICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShlbGVtZW50LCBjYWxsYmFjaylcbiAgICAgIH0pXG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnQXNzaWdubWVudFBhdHRlcm4nOlxuICAgICAgY2FsbGJhY2socGF0dGVybi5sZWZ0KVxuICAgICAgYnJlYWtcbiAgfVxufVxuXG4vKipcbiAqIGRvbid0IGhvbGQgZnVsbCBjb250ZXh0IG9iamVjdCBpbiBtZW1vcnksIGp1c3QgZ3JhYiB3aGF0IHdlIG5lZWQuXG4gKi9cbmZ1bmN0aW9uIGNoaWxkQ29udGV4dChwYXRoLCBjb250ZXh0KSB7XG4gIGNvbnN0IHsgc2V0dGluZ3MsIHBhcnNlck9wdGlvbnMsIHBhcnNlclBhdGggfSA9IGNvbnRleHRcbiAgcmV0dXJuIHtcbiAgICBzZXR0aW5ncyxcbiAgICBwYXJzZXJPcHRpb25zLFxuICAgIHBhcnNlclBhdGgsXG4gICAgcGF0aCxcbiAgfVxufVxuXG5cbi8qKlxuICogc29tZXRpbWVzIGxlZ2FjeSBzdXBwb3J0IGlzbid0IF90aGF0XyBoYXJkLi4uIHJpZ2h0P1xuICovXG5mdW5jdGlvbiBtYWtlU291cmNlQ29kZSh0ZXh0LCBhc3QpIHtcbiAgaWYgKFNvdXJjZUNvZGUubGVuZ3RoID4gMSkge1xuICAgIC8vIEVTTGludCAzXG4gICAgcmV0dXJuIG5ldyBTb3VyY2VDb2RlKHRleHQsIGFzdClcbiAgfSBlbHNlIHtcbiAgICAvLyBFU0xpbnQgNCwgNVxuICAgIHJldHVybiBuZXcgU291cmNlQ29kZSh7IHRleHQsIGFzdCB9KVxuICB9XG59XG4iXX0=