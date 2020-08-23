// This is a modified version of the graph-getting in bolt
import semver from "semver";
import chalk from "chalk";
import { Packages, Package } from "@manypkg/get-packages";
import { PackageJSON } from "@changesets/types";

const DEPENDENCY_TYPES = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
] as const;

const getAllDependencies = (config: PackageJSON) => {
  const allDependencies = new Map();

  for (const type of DEPENDENCY_TYPES) {
    const deps = config[type];
    if (!deps) continue;

    for (const name of Object.keys(deps)) {
      const depVersion = deps[name];
      if (
        (depVersion.startsWith("link:") || depVersion.startsWith("file:")) &&
        type === "devDependencies"
      ) {
        continue;
      }

      allDependencies.set(name, depVersion);
    }
  }

  return allDependencies;
};

export default function getDependencyGraph(
  packages: Packages
): {
  graph: Map<string, { pkg: Package; dependencies: Array<string> }>;
  valid: boolean;
} {
  const graph = new Map<
    string,
    { pkg: Package; dependencies: Array<string> }
  >();
  let valid = true;

  const packagesByName: { [key: string]: Package } = {
    [packages.root.packageJson.name]: packages.root
  };

  const queue = [packages.root];

  for (const pkg of packages.packages) {
    queue.push(pkg);
    packagesByName[pkg.packageJson.name] = pkg;
  }

  for (const pkg of queue) {
    const { name } = pkg.packageJson;
    const dependencies = [];
    const allDependencies = getAllDependencies(pkg.packageJson);

    for (let [depName, depVersion] of allDependencies) {
      const match = packagesByName[depName];
      if (!match) continue;

      const expected = match.packageJson.version;

      if (depVersion.startsWith("workspace:")) {
        depVersion = depVersion.substr(10);
      }

      // internal dependencies only need to semver satisfy, not '==='
      if (!semver.satisfies(expected, depVersion)) {
        valid = false;
        console.error(
          `Package ${chalk.cyan(
            `"${name}"`
          )} must depend on the current version of ${chalk.cyan(
            `"${depName}"`
          )}: ${chalk.green(`"${expected}"`)} vs ${chalk.red(
            `"${depVersion}"`
          )}`
        );
        continue;
      }

      dependencies.push(depName);
    }

    graph.set(name, { pkg, dependencies });
  }
  return { graph, valid };
}
