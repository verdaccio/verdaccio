import { readFile, writeFile } from 'fs-extra';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import { PreExitButNotInPreModeError, PreEnterButInPreModeError } from '@changesets/errors';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
async function readPreState(cwd) {
  let preStatePath = path.resolve(cwd, ".changeset", "pre.json"); // TODO: verify that the pre state isn't broken

  let preState;

  try {
    let contents = await readFile(preStatePath, "utf8");

    try {
      preState = JSON.parse(contents);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error("error parsing json:", contents);
      }

      throw err;
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return preState;
}
async function exitPre(cwd) {
  let preStatePath = path.resolve(cwd, ".changeset", "pre.json"); // TODO: verify that the pre state isn't broken

  let preState = await readPreState(cwd);

  if (preState === undefined) {
    throw new PreExitButNotInPreModeError();
  }

  await writeFile(preStatePath, JSON.stringify(_objectSpread({}, preState, {
    mode: "exit"
  }), null, 2) + "\n");
}
async function enterPre(cwd, tag) {
  let packages = await getPackages(cwd);
  let preStatePath = path.resolve(packages.root.dir, ".changeset", "pre.json"); // TODO: verify that the pre state isn't broken

  let preState = await readPreState(packages.root.dir);

  if (preState !== undefined) {
    throw new PreEnterButInPreModeError();
  }

  let newPreState = {
    mode: "pre",
    tag,
    initialVersions: {},
    changesets: []
  };

  for (let pkg of packages.packages) {
    newPreState.initialVersions[pkg.packageJson.name] = pkg.packageJson.version;
  }

  await writeFile(preStatePath, JSON.stringify(newPreState, null, 2) + "\n");
}

export { enterPre, exitPre, readPreState };
