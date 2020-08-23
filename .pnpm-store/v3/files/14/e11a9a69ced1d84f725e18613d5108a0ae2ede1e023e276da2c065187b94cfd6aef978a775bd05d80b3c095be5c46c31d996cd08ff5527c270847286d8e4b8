"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var semver = _interopDefault(require("semver")), chalk = _interopDefault(require("chalk"));

const DEPENDENCY_TYPES = [ "dependencies", "devDependencies", "peerDependencies", "optionalDependencies" ], getAllDependencies = config => {
  const allDependencies = new Map;
  for (const type of DEPENDENCY_TYPES) {
    const deps = config[type];
    if (deps) for (const name of Object.keys(deps)) {
      const depVersion = deps[name];
      (depVersion.startsWith("link:") || depVersion.startsWith("file:")) && "devDependencies" === type || allDependencies.set(name, depVersion);
    }
  }
  return allDependencies;
};

function getDependencyGraph(packages) {
  const graph = new Map;
  let valid = !0;
  const packagesByName = {
    [packages.root.packageJson.name]: packages.root
  }, queue = [ packages.root ];
  for (const pkg of packages.packages) queue.push(pkg), packagesByName[pkg.packageJson.name] = pkg;
  for (const pkg of queue) {
    const {name: name} = pkg.packageJson, dependencies = [], allDependencies = getAllDependencies(pkg.packageJson);
    for (let [depName, depVersion] of allDependencies) {
      const match = packagesByName[depName];
      if (!match) continue;
      const expected = match.packageJson.version;
      depVersion.startsWith("workspace:") && (depVersion = depVersion.substr(10)), semver.satisfies(expected, depVersion) ? dependencies.push(depName) : (valid = !1, 
      console.error(`Package ${chalk.cyan(`"${name}"`)} must depend on the current version of ${chalk.cyan(`"${depName}"`)}: ${chalk.green(`"${expected}"`)} vs ${chalk.red(`"${depVersion}"`)}`));
    }
    graph.set(name, {
      pkg: pkg,
      dependencies: dependencies
    });
  }
  return {
    graph: graph,
    valid: valid
  };
}

function getDependentsGraph(packages) {
  const graph = new Map, {graph: dependencyGraph} = getDependencyGraph(packages), dependentsLookup = {};
  packages.packages.forEach(pkg => {
    dependentsLookup[pkg.packageJson.name] = {
      pkg: pkg,
      dependents: []
    };
  }), packages.packages.forEach(pkg => {
    const dependent = pkg.packageJson.name, valFromDependencyGraph = dependencyGraph.get(dependent);
    if (valFromDependencyGraph) {
      valFromDependencyGraph.dependencies.forEach(dependency => {
        dependentsLookup[dependency].dependents.push(dependent);
      });
    }
  }), Object.keys(dependentsLookup).forEach(key => {
    graph.set(key, dependentsLookup[key]);
  });
  const simplifiedDependentsGraph = new Map;
  return graph.forEach((pkgInfo, pkgName) => {
    simplifiedDependentsGraph.set(pkgName, pkgInfo.dependents);
  }), simplifiedDependentsGraph;
}

exports.getDependentsGraph = getDependentsGraph;
