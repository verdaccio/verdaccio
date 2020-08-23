import { defaultConfig } from "@changesets/config";
import assembleReleasePlan from "./";
import FakeFullState from "./test-utils";

describe("assemble-release-plan", () => {
  let setup: FakeFullState;
  beforeEach(() => {
    setup = new FakeFullState();

    setup.addPackage("pkg-b", "1.0.0");
    setup.addPackage("pkg-c", "1.0.0");
    setup.addPackage("pkg-d", "1.0.0");
  });

  it("should assemble release plan for basic setup", () => {
    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(1);
    expect(releases[0]).toEqual({
      name: "pkg-a",
      type: "patch",
      newVersion: "1.0.1",
      oldVersion: "1.0.0",
      changesets: ["strange-words-combine"]
    });
  });
  it("should assemble release plan with multiple packages", () => {
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [
        { name: "pkg-b", type: "patch" },
        { name: "pkg-c", type: "patch" },
        { name: "pkg-d", type: "major" }
      ]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(4);
    expect(releases[0].name).toBe("pkg-a");
    expect(releases[0].newVersion).toBe("1.0.1");
    expect(releases[1].name).toBe("pkg-b");
    expect(releases[1].newVersion).toBe("1.0.1");
    expect(releases[2].name).toBe("pkg-c");
    expect(releases[2].newVersion).toBe("1.0.1");
    expect(releases[3].name).toBe("pkg-d");
    expect(releases[3].newVersion).toBe("2.0.0");
  });
  it("should handle two changesets for a package", () => {
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(1);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].type).toEqual("major");
    expect(releases[0].newVersion).toEqual("2.0.0");
  });
  it("should assemble release plan with dependents", () => {
    setup.updateDependency("pkg-b", "pkg-a", "^1.0.0");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
    expect(releases[1].changesets).toEqual([]);
  });
  it("should assemble release plan without dependent through dev dependency", () => {
    setup.updateDevDependency("pkg-b", "pkg-a", "^1.0.0");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.0");
  });
  it("should assemble release plan with dependent when the dependent has both a changed prod and dev dependency", () => {
    setup.updateDevDependency("pkg-b", "pkg-a", "^1.0.0");
    setup.updateDependency("pkg-b", "pkg-c", "^1.0.0");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [
        { name: "pkg-a", type: "major" },
        { name: "pkg-c", type: "major" }
      ]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(3);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-c");
    expect(releases[1].newVersion).toEqual("2.0.0");
    expect(releases[2].name).toEqual("pkg-b");
    expect(releases[2].oldVersion).toEqual("1.0.0");
    expect(releases[2].newVersion).toEqual("1.0.1");
  });
  it("should assemble release plan without dependent through the link protocol", () => {
    setup.updateDevDependency("pkg-b", "pkg-a", "link:../pkg-a");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(1);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
  });
  it("should assemble release plan without dependent through the file protocol", () => {
    setup.updateDevDependency("pkg-b", "pkg-a", "file:../pkg-a");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(1);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
  });
  it("should assemble release plan for linked packages", () => {
    setup.addChangeset({
      id: "just-some-umbrellas",
      releases: [{ name: "pkg-b", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-b"]] },
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
  it("should assemble a release plan where new highest version is set by an unreleased package", () => {
    setup.addChangeset({
      id: "just-some-umbrellas",
      releases: [
        { name: "pkg-b", type: "minor" },
        { name: "pkg-a", type: "patch" }
      ]
    });

    setup.updatePackage("pkg-c", "2.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-b", "pkg-c"]] },
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].newVersion).toEqual("2.1.0");
    expect(releases[1].newVersion).toEqual("2.1.0");
  });
  it("should assemble release plan where a link causes a dependency to need changing which causes a second link to update", () => {
    /*
      Expected events:
      - dependencies are checked, nothing leaves semver, nothing changes
      - linked are checked, pkg-a is aligned with pkg-b
      - depencencies are checked, pkg-c is now outside its dependency on pkg-a, and is given a patch
      - linked is checked, pkg-c is aligned with pkg-d
    */
    setup.addChangeset({
      id: "just-some-umbrellas",
      releases: [{ name: "pkg-b", type: "major" }]
    });
    setup.addChangeset({
      id: "totally-average-verbiage",
      releases: [{ name: "pkg-d", type: "minor" }]
    });

    setup.updateDependency("pkg-c", "pkg-a", "^1.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-b"], ["pkg-c", "pkg-d"]] },
      undefined
    );

    expect(releases.length).toEqual(4);
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].newVersion).toEqual("2.0.0");
    expect(releases[2].newVersion).toEqual("1.1.0");
    expect(releases[3].newVersion).toEqual("1.1.0");
  });
  it("should return an empty release array when no chnages will occur", () => {
    let { releases } = assembleReleasePlan(
      [],
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-b"], ["pkg-c", "pkg-d"]] },
      undefined
    );

    expect(releases).toEqual([]);
  });
  it("should update multiple dependencies of a single package", () => {
    setup.updateDependency("pkg-b", "pkg-a", "1.0.0");
    setup.updateDependency("pkg-c", "pkg-a", "1.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-b"], ["pkg-c", "pkg-d"]] },
      undefined
    );

    expect(releases.length).toEqual(3);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.0.1");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
    expect(releases[2].name).toEqual("pkg-c");
    expect(releases[2].newVersion).toEqual("1.0.1");
  });
  it("should update a second dependent based on updating a first dependant", () => {
    setup.updateDependency("pkg-b", "pkg-a", "1.0.0");
    setup.updateDependency("pkg-c", "pkg-b", "1.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-b"], ["pkg-c", "pkg-d"]] },
      undefined
    );

    expect(releases.length).toEqual(3);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.0.1");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
    expect(releases[2].name).toEqual("pkg-c");
    expect(releases[2].newVersion).toEqual("1.0.1");
  });

  it("should bump peer dependents where the version is updated because of linked", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "1.0.0");

    setup.addChangeset({
      id: "some-id",
      releases: [{ type: "minor", name: "pkg-c" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      { ...defaultConfig, linked: [["pkg-a", "pkg-c"]] },
      undefined
    );

    expect(releases).toMatchObject([
      {
        name: "pkg-a",
        newVersion: "1.1.0"
      },
      {
        name: "pkg-c",
        newVersion: "1.1.0"
      },
      {
        name: "pkg-b",
        newVersion: "2.0.0"
      }
    ]);
  });
  it("should update a peerDep by a major bump", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "~1.0.0");
    setup.addChangeset({
      id: "nonsense-words-combine",
      releases: [{ name: "pkg-a", type: "minor" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.1.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
  it("should assemble release plan without ignored packages", () => {
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });
    setup.addChangeset({
      id: "small-dogs-sad",
      releases: [{ name: "pkg-b", type: "minor" }]
    });
    const { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      {
        ...defaultConfig,
        ignore: ["pkg-b"]
      },
      undefined
    );

    expect(releases.length).toEqual(1);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
  });
  it("should generate releases with 'none' release type for ignored packages through dependencies", () => {
    setup.updateDependency("pkg-b", "pkg-a", "1.0.0");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });
    setup.addChangeset({
      id: "small-dogs-sad",
      releases: [{ name: "pkg-b", type: "minor" }]
    });
    const { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      {
        ...defaultConfig,
        ignore: ["pkg-b"]
      },
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].type).toEqual("none");
    expect(releases[1].newVersion).toEqual("1.0.0");
  });
  it("should generate releases with 'none' release type for ignored packages through peerDependencies", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "1.0.0");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });
    setup.addChangeset({
      id: "small-dogs-sad",
      releases: [{ name: "pkg-b", type: "minor" }]
    });
    const { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      {
        ...defaultConfig,
        ignore: ["pkg-b"]
      },
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].type).toEqual("none");
    expect(releases[1].newVersion).toEqual("1.0.0");
  });
  it("should generate releases with 'none' release type for ignored packages through devDependencies", () => {
    setup.updateDevDependency("pkg-b", "pkg-a", "1.0.0");
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [{ name: "pkg-a", type: "major" }]
    });
    setup.addChangeset({
      id: "small-dogs-sad",
      releases: [{ name: "pkg-b", type: "minor" }]
    });
    const { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      {
        ...defaultConfig,
        ignore: ["pkg-b"]
      },
      undefined
    );

    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].type).toEqual("none");
    expect(releases[1].newVersion).toEqual("1.0.0");
  });
  // Mixed changesets are the ones that contains both ignored packages and not ignored packages
  it("should throw for mixed changesets", () => {
    setup.addChangeset({
      id: "big-cats-delight",
      releases: [
        { name: "pkg-a", type: "major" },
        { name: "pkg-b", type: "minor" }
      ]
    });

    expect(() =>
      assembleReleasePlan(
        setup.changesets,
        setup.packages,
        {
          ...defaultConfig,
          ignore: ["pkg-b"]
        },
        undefined
      )
    ).toThrowErrorMatchingInlineSnapshot(`
"Found mixed changeset big-cats-delight
Found ignored packages: pkg-b
Found not ignored packages: pkg-a
Mixed changesets that contain both ignored and not ignored packages are not allowed"
`);
  });

  describe("pre mode exit", () => {
    it("should not generate a release for package that has no changesets and is not a dependent of any packages being released", () => {
      const { releases } = assembleReleasePlan(
        setup.changesets,
        setup.packages,
        {
          ...defaultConfig
        },
        {
          changesets: [],
          tag: "next",
          initialVersions: {},
          mode: "exit"
        }
      );

      expect(releases.length).toEqual(1);
      expect(releases[0].name).toEqual("pkg-a");
      expect(releases[0].newVersion).toEqual("1.0.1");
    });
  });
});

describe("version update thoroughness", () => {
  let setup: FakeFullState;
  beforeEach(() => {
    setup = new FakeFullState();

    setup.addPackage("pkg-b", "1.0.0");
    setup.addPackage("pkg-c", "1.0.0");
    setup.addPackage("pkg-d", "1.0.0");
    setup.updateDependency("pkg-b", "pkg-a", "1.0.0");
    setup.updateDependency("pkg-c", "pkg-a", "~1.0.0");
    setup.updateDependency("pkg-d", "pkg-a", "^1.0.0");
  });

  it("should patch a single pinned dependent", () => {
    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );
    expect(releases.length).toEqual(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.0.1");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
  });
  it("should path a pinned and tilde dependents when minor versioning", () => {
    setup.addChangeset({
      id: "stuff-and-nonsense",
      releases: [{ name: "pkg-a", type: "minor" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(3);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.1.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
    expect(releases[2].name).toEqual("pkg-c");
    expect(releases[2].newVersion).toEqual("1.0.1");
  });
  it("should patch pinned, tilde and caret dependents when a major versioning", () => {
    setup.addChangeset({
      id: "stuff-and-nonsense",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toEqual(4);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
    expect(releases[2].name).toEqual("pkg-c");
    expect(releases[2].newVersion).toEqual("1.0.1");
    expect(releases[3].name).toEqual("pkg-d");
    expect(releases[3].newVersion).toEqual("1.0.1");
  });
});

describe("bumping peerDeps", () => {
  let setup: FakeFullState;
  beforeEach(() => {
    setup = new FakeFullState();
    setup.addPackage("pkg-b", "1.0.0");
  });

  it("should patch a pinned peerDep", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "1.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.0.1");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("1.0.1");
  });
  it("should not bump the dependent when bumping a tilde peerDep by a patch", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "~1.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(1);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.0.1");
  });
  it("should major bump dependent when bumping a tilde peerDep by minor", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "~1.0.0");
    setup.addChangeset({
      id: "anyway-the-windblows",
      releases: [{ name: "pkg-a", type: "minor" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.1.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
  it("should major bump dependent when bumping a tilde peerDep by major", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "~1.0.0");
    setup.addChangeset({
      id: "anyway-the-windblows",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
  it("should not bump dependent when bumping caret peerDep by patch", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "^1.0.0");

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(1);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.0.1");
  });
  it("should major bump dependent when bumping caret peerDep by minor", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "^1.0.0");
    setup.addChangeset({
      id: "anyway-the-windblows",
      releases: [{ name: "pkg-a", type: "minor" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.1.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
  it("should major bump dependent when bumping caret peerDep by major", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "^1.0.0");
    setup.addChangeset({
      id: "anyway-the-windblows",
      releases: [{ name: "pkg-a", type: "major" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("2.0.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
  it("should patch bump transitive dep that is only affected by peerDep bump", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "^1.0.0");
    setup.addPackage("pkg-c", "1.0.0");
    setup.updateDependency("pkg-c", "pkg-b", "^1.0.0");
    setup.addChangeset({
      id: "anyway-the-windblows",
      releases: [{ name: "pkg-a", type: "minor" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      defaultConfig,
      undefined
    );

    expect(releases.length).toBe(3);
    expect(releases[0]).toMatchObject({
      name: "pkg-a",
      newVersion: "1.1.0"
    });
    expect(releases[1]).toMatchObject({
      name: "pkg-b",
      newVersion: "2.0.0"
    });
    expect(releases[2]).toMatchObject({
      name: "pkg-c",
      newVersion: "1.0.1"
    });
  });

  describe("onlyUpdatePeerDependentsWhenOutOfRange: true", () => {
    it("should not bump dependent when still in range", () => {
      setup.updatePeerDep("pkg-b", "pkg-a", "^1.0.0");
      setup.addChangeset({
        id: "anyway-the-windblows",
        releases: [{ name: "pkg-a", type: "minor" }]
      });
      let { releases } = assembleReleasePlan(
        setup.changesets,
        setup.packages,
        {
          ...defaultConfig,
          ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
            onlyUpdatePeerDependentsWhenOutOfRange: true,
            useCalculatedVersionForSnapshots: false
          }
        },
        undefined
      );
      expect(releases.length).toBe(1);
      expect(releases[0].name).toEqual("pkg-a");
      expect(releases[0].newVersion).toEqual("1.1.0");
    });
  });

  it("should major bump dependent when leaving range", () => {
    setup.updatePeerDep("pkg-b", "pkg-a", "~1.0.0");
    setup.addChangeset({
      id: "anyway-the-windblows",
      releases: [{ name: "pkg-a", type: "minor" }]
    });

    let { releases } = assembleReleasePlan(
      setup.changesets,
      setup.packages,
      {
        ...defaultConfig,
        ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
          onlyUpdatePeerDependentsWhenOutOfRange: true,
          useCalculatedVersionForSnapshots: false
        }
      },
      undefined
    );

    expect(releases.length).toBe(2);
    expect(releases[0].name).toEqual("pkg-a");
    expect(releases[0].newVersion).toEqual("1.1.0");
    expect(releases[1].name).toEqual("pkg-b");
    expect(releases[1].newVersion).toEqual("2.0.0");
  });
});

/*
    Bumping peerDeps is a tricky issue, so we are testing every single combination here so that
    we can have absolute certainty when changing anything to do with them.
    In general the rule for bumping peerDeps is that:
      * All MINOR or MAJOR peerDep bumps must MAJOR bump all dependents - regardless of ranges
      * Otherwise - normal patching rules apply
 */
