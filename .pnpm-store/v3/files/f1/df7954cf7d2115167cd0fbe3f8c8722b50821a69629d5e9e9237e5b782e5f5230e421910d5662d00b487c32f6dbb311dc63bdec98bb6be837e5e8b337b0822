import getDependencyGraph from "./get-dependency-graph";

describe("getting the dependency graph", function() {
  it("should skip dependencies specified through the link protocol", function() {
    const { graph, valid } = getDependencyGraph({
      root: {
        dir: ".",
        packageJson: { name: "root", version: "1.0.0" }
      },
      packages: [
        {
          dir: "foo",
          packageJson: {
            name: "foo",
            version: "1.0.0",
            devDependencies: {
              bar: "link:../bar"
            }
          }
        },
        {
          dir: "bar",
          packageJson: {
            name: "bar",
            version: "1.0.0"
          }
        }
      ],
      tool: "pnpm"
    });
    expect(graph.get("foo")!.dependencies).toStrictEqual([]);
    expect(valid).toBeTruthy();
  });
  it("should set valid to false if the link protocol is used in a non-dev dep", function() {
    const { valid } = getDependencyGraph({
      root: {
        dir: ".",
        packageJson: { name: "root", version: "1.0.0" }
      },
      packages: [
        {
          dir: "foo",
          packageJson: {
            name: "foo",
            version: "1.0.0",
            dependencies: {
              bar: "link:../bar"
            }
          }
        },
        {
          dir: "bar",
          packageJson: {
            name: "bar",
            version: "1.0.0"
          }
        }
      ],
      tool: "pnpm"
    });
    expect(valid).toBeFalsy();
  });
});
