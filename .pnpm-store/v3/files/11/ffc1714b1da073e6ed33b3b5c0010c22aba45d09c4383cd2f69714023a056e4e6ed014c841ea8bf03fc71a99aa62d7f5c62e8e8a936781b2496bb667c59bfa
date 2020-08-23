import semver from 'semver';
import chalk from 'chalk';

// This is a modified version of the graph-getting in bolt
const DEPENDENCY_TYPES = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

const getAllDependencies = config => {
  const allDependencies = new Map();

  for (const type of DEPENDENCY_TYPES) {
    const deps = config[type];
    if (!deps) continue;

    for (const name of Object.keys(deps)) {
      const depVersion = deps[name];

      if ((depVersion.startsWith("link:") || depVersion.startsWith("file:")) && type === "devDependencies") {
        continue;
      }

      allDependencies.set(name, depVersion);
    }
  }

  return allDependencies;
};

function getDependencyGraph(packages) {
  const graph = new Map();
  let valid = true;
  const packagesByName = {
    [packages.root.packageJson.name]: packages.root
  };
  const queue = [packages.root];

  for (const pkg of packages.packages) {
    queue.push(pkg);
    packagesByName[pkg.packageJson.name] = pkg;
  }

  for (const pkg of queue) {
    const {
      name
    } = pkg.packageJson;
    const dependencies = [];
    const allDependencies = getAllDependencies(pkg.packageJson);

    for (let [depName, depVersion] of allDependencies) {
      const match = packagesByName[depName];
      if (!match) continue;
      const expected = match.packageJson.version;

      if (depVersion.startsWith("workspace:")) {
        depVersion = depVersion.substr(10);
      } // internal dependencies only need to semver satisfy, not '==='


      if (!semver.satisfies(expected, depVersion)) {
        valid = false;
        console.error(`Package ${chalk.cyan(`"${name}"`)} must depend on the current version of ${chalk.cyan(`"${depName}"`)}: ${chalk.green(`"${expected}"`)} vs ${chalk.red(`"${depVersion}"`)}`);
        continue;
      }

      dependencies.push(depName);
    }

    graph.set(name, {
      pkg,
      dependencies
    });
  }

  return {
    graph,
    valid
  };
}

function getDependentsGraph(packages) {
  const graph = new Map();
  const {
    graph: dependencyGraph
  } = getDependencyGraph(packages);
  const dependentsLookup = {};
  packages.packages.forEach(pkg => {
    dependentsLookup[pkg.packageJson.name] = {
      pkg,
      dependents: []
    };
  });
  packages.packages.forEach(pkg => {
    const dependent = pkg.packageJson.name;
    const valFromDependencyGraph = dependencyGraph.get(dependent);

    if (valFromDependencyGraph) {
      const dependencies = valFromDependencyGraph.dependencies;
      dependencies.forEach(dependency => {
        dependentsLookup[dependency].dependents.push(dependent);
      });
    }
  });
  Object.keys(dependentsLookup).forEach(key => {
    graph.set(key, dependentsLookup[key]);
  });
  const simplifiedDependentsGraph = new Map();
  graph.forEach((pkgInfo, pkgName) => {
    simplifiedDependentsGraph.set(pkgName, pkgInfo.dependents);
  });
  return simplifiedDependentsGraph;
}

export { getDependentsGraph };
