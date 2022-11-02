import { URL, fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';
import moduleExports, { Module } from 'module';

var PathType;
(function(PathType2) {
  PathType2[PathType2["File"] = 0] = "File";
  PathType2[PathType2["Portable"] = 1] = "Portable";
  PathType2[PathType2["Native"] = 2] = "Native";
})(PathType || (PathType = {}));
const npath = Object.create(path);
const ppath = Object.create(path.posix);
npath.cwd = () => process.cwd();
ppath.cwd = () => toPortablePath(process.cwd());
ppath.resolve = (...segments) => {
  if (segments.length > 0 && ppath.isAbsolute(segments[0])) {
    return path.posix.resolve(...segments);
  } else {
    return path.posix.resolve(ppath.cwd(), ...segments);
  }
};
const contains = function(pathUtils, from, to) {
  from = pathUtils.normalize(from);
  to = pathUtils.normalize(to);
  if (from === to)
    return `.`;
  if (!from.endsWith(pathUtils.sep))
    from = from + pathUtils.sep;
  if (to.startsWith(from)) {
    return to.slice(from.length);
  } else {
    return null;
  }
};
npath.fromPortablePath = fromPortablePath;
npath.toPortablePath = toPortablePath;
npath.contains = (from, to) => contains(npath, from, to);
ppath.contains = (from, to) => contains(ppath, from, to);
const WINDOWS_PATH_REGEXP = /^([a-zA-Z]:.*)$/;
const UNC_WINDOWS_PATH_REGEXP = /^\/\/(\.\/)?(.*)$/;
const PORTABLE_PATH_REGEXP = /^\/([a-zA-Z]:.*)$/;
const UNC_PORTABLE_PATH_REGEXP = /^\/unc\/(\.dot\/)?(.*)$/;
function fromPortablePath(p) {
  if (process.platform !== `win32`)
    return p;
  let portablePathMatch, uncPortablePathMatch;
  if (portablePathMatch = p.match(PORTABLE_PATH_REGEXP))
    p = portablePathMatch[1];
  else if (uncPortablePathMatch = p.match(UNC_PORTABLE_PATH_REGEXP))
    p = `\\\\${uncPortablePathMatch[1] ? `.\\` : ``}${uncPortablePathMatch[2]}`;
  else
    return p;
  return p.replace(/\//g, `\\`);
}
function toPortablePath(p) {
  if (process.platform !== `win32`)
    return p;
  p = p.replace(/\\/g, `/`);
  let windowsPathMatch, uncWindowsPathMatch;
  if (windowsPathMatch = p.match(WINDOWS_PATH_REGEXP))
    p = `/${windowsPathMatch[1]}`;
  else if (uncWindowsPathMatch = p.match(UNC_WINDOWS_PATH_REGEXP))
    p = `/unc/${uncWindowsPathMatch[1] ? `.dot/` : ``}${uncWindowsPathMatch[2]}`;
  return p;
}

const builtinModules = new Set(Module.builtinModules || Object.keys(process.binding(`natives`)));
const isBuiltinModule = (request) => request.startsWith(`node:`) || builtinModules.has(request);
function readPackageScope(checkPath) {
  const rootSeparatorIndex = checkPath.indexOf(npath.sep);
  let separatorIndex;
  do {
    separatorIndex = checkPath.lastIndexOf(npath.sep);
    checkPath = checkPath.slice(0, separatorIndex);
    if (checkPath.endsWith(`${npath.sep}node_modules`))
      return false;
    const pjson = readPackage(checkPath + npath.sep);
    if (pjson) {
      return {
        data: pjson,
        path: checkPath
      };
    }
  } while (separatorIndex > rootSeparatorIndex);
  return false;
}
function readPackage(requestPath) {
  const jsonPath = npath.resolve(requestPath, `package.json`);
  if (!fs.existsSync(jsonPath))
    return null;
  return JSON.parse(fs.readFileSync(jsonPath, `utf8`));
}

const [major, minor] = process.versions.node.split(`.`).map((value) => parseInt(value, 10));
const HAS_CONSOLIDATED_HOOKS = major > 16 || major === 16 && minor >= 12;
const HAS_UNFLAGGED_JSON_MODULES = major > 17 || major === 17 && minor >= 5 || major === 16 && minor >= 15;
const HAS_JSON_IMPORT_ASSERTION_REQUIREMENT = major > 17 || major === 17 && minor >= 1 || major === 16 && minor > 14;

async function tryReadFile(path2) {
  try {
    return await fs.promises.readFile(path2, `utf8`);
  } catch (error) {
    if (error.code === `ENOENT`)
      return null;
    throw error;
  }
}
function tryParseURL(str, base) {
  try {
    return new URL(str, base);
  } catch {
    return null;
  }
}
let entrypointPath = null;
function setEntrypointPath(file) {
  entrypointPath = file;
}
function getFileFormat(filepath) {
  var _a, _b;
  const ext = path.extname(filepath);
  switch (ext) {
    case `.mjs`: {
      return `module`;
    }
    case `.cjs`: {
      return `commonjs`;
    }
    case `.wasm`: {
      throw new Error(`Unknown file extension ".wasm" for ${filepath}`);
    }
    case `.json`: {
      if (HAS_UNFLAGGED_JSON_MODULES)
        return `json`;
      throw new Error(`Unknown file extension ".json" for ${filepath}`);
    }
    case `.js`: {
      const pkg = readPackageScope(filepath);
      if (!pkg)
        return `commonjs`;
      return (_a = pkg.data.type) != null ? _a : `commonjs`;
    }
    default: {
      if (entrypointPath !== filepath)
        return null;
      const pkg = readPackageScope(filepath);
      if (!pkg)
        return `commonjs`;
      if (pkg.data.type === `module`)
        return null;
      return (_b = pkg.data.type) != null ? _b : `commonjs`;
    }
  }
}

async function getFormat$1(resolved, context, defaultGetFormat) {
  const url = tryParseURL(resolved);
  if ((url == null ? void 0 : url.protocol) !== `file:`)
    return defaultGetFormat(resolved, context, defaultGetFormat);
  const format = getFileFormat(fileURLToPath(url));
  if (format) {
    return {
      format
    };
  }
  return defaultGetFormat(resolved, context, defaultGetFormat);
}

async function getSource$1(urlString, context, defaultGetSource) {
  const url = tryParseURL(urlString);
  if ((url == null ? void 0 : url.protocol) !== `file:`)
    return defaultGetSource(urlString, context, defaultGetSource);
  return {
    source: await fs.promises.readFile(fileURLToPath(url), `utf8`)
  };
}

async function load$1(urlString, context, nextLoad) {
  var _a;
  const url = tryParseURL(urlString);
  if ((url == null ? void 0 : url.protocol) !== `file:`)
    return nextLoad(urlString, context, nextLoad);
  const filePath = fileURLToPath(url);
  const format = getFileFormat(filePath);
  if (!format)
    return nextLoad(urlString, context, nextLoad);
  if (HAS_JSON_IMPORT_ASSERTION_REQUIREMENT && format === `json` && ((_a = context.importAssertions) == null ? void 0 : _a.type) !== `json`) {
    const err = new TypeError(`[ERR_IMPORT_ASSERTION_TYPE_MISSING]: Module "${urlString}" needs an import assertion of type "json"`);
    err.code = `ERR_IMPORT_ASSERTION_TYPE_MISSING`;
    throw err;
  }
  return {
    format,
    source: await fs.promises.readFile(filePath, `utf8`),
    shortCircuit: true
  };
}

const pathRegExp = /^(?![a-zA-Z]:[\\/]|\\\\|\.{0,2}(?:\/|$))((?:node:)?(?:@[^/]+\/)?[^/]+)\/*(.*|)$/;
const isRelativeRegexp = /^\.{0,2}\//;
async function resolve$1(originalSpecifier, context, nextResolve) {
  var _a;
  const {findPnpApi} = moduleExports;
  if (!findPnpApi || isBuiltinModule(originalSpecifier))
    return nextResolve(originalSpecifier, context, nextResolve);
  let specifier = originalSpecifier;
  const url = tryParseURL(specifier, isRelativeRegexp.test(specifier) ? context.parentURL : void 0);
  if (url) {
    if (url.protocol !== `file:`)
      return nextResolve(originalSpecifier, context, nextResolve);
    specifier = fileURLToPath(url);
  }
  const {parentURL, conditions = []} = context;
  const issuer = parentURL ? fileURLToPath(parentURL) : process.cwd();
  const pnpapi = (_a = findPnpApi(issuer)) != null ? _a : url ? findPnpApi(specifier) : null;
  if (!pnpapi)
    return nextResolve(originalSpecifier, context, nextResolve);
  const dependencyNameMatch = specifier.match(pathRegExp);
  let allowLegacyResolve = false;
  if (dependencyNameMatch) {
    const [, dependencyName, subPath] = dependencyNameMatch;
    if (subPath === ``) {
      const resolved = pnpapi.resolveToUnqualified(`${dependencyName}/package.json`, issuer);
      if (resolved) {
        const content = await tryReadFile(resolved);
        if (content) {
          const pkg = JSON.parse(content);
          allowLegacyResolve = pkg.exports == null;
        }
      }
    }
  }
  const result = pnpapi.resolveRequest(specifier, issuer, {
    conditions: new Set(conditions),
    extensions: allowLegacyResolve ? void 0 : []
  });
  if (!result)
    throw new Error(`Resolving '${specifier}' from '${issuer}' failed`);
  const resultURL = pathToFileURL(result);
  if (url) {
    resultURL.search = url.search;
    resultURL.hash = url.hash;
  }
  if (!parentURL)
    setEntrypointPath(fileURLToPath(resultURL));
  return {
    url: resultURL.href,
    shortCircuit: true
  };
}

const binding = process.binding(`fs`);
const originalfstat = binding.fstat;
const ZIP_MASK = 4278190080;
const ZIP_MAGIC = 704643072;
binding.fstat = function(...args) {
  const [fd, useBigint, req] = args;
  if ((fd & ZIP_MASK) === ZIP_MAGIC && useBigint === false && req === void 0) {
    try {
      const stats = fs.fstatSync(fd);
      return new Float64Array([
        stats.dev,
        stats.mode,
        stats.nlink,
        stats.uid,
        stats.gid,
        stats.rdev,
        stats.blksize,
        stats.ino,
        stats.size,
        stats.blocks
      ]);
    } catch {
    }
  }
  return originalfstat.apply(this, args);
};

const resolve = resolve$1;
const getFormat = HAS_CONSOLIDATED_HOOKS ? void 0 : getFormat$1;
const getSource = HAS_CONSOLIDATED_HOOKS ? void 0 : getSource$1;
const load = HAS_CONSOLIDATED_HOOKS ? load$1 : void 0;

export { getFormat, getSource, load, resolve };
