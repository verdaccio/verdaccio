# @changesets/assemble-release-plan

## 3.0.0

### Major Changes

- [`addd725`](https://github.com/atlassian/changesets/commit/addd7256d9251d999251a7c16c0a0b068d557b5d) [#383](https://github.com/atlassian/changesets/pull/383) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Added an experimental flag `onlyUpdatePeerDependentsWhenOutOfRange`. When set to `true`, we only bump peer dependents when peerDependencies are leaving range.

### Minor Changes

- [`9dcc364`](https://github.com/atlassian/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04) [#371](https://github.com/atlassian/changesets/pull/371) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Added support for ignoring packages in the `version` command. The version of ignored packages will not be bumped, but their dependencies will still be bumped normally. This is useful when you have private packages, e.g. packages under development. It allows you to make releases for the public packages without changing the version of your private packages. To use the feature, you can define the `ignore` array in the config file with the name of the packages:

  ```
  {
    ...
    "ignore": ["pkg-a", "pkg-b"]
    ...
  }
  ```

  or you can pass the package names to the `--ignore` flag when using cli:

  ```
  yarn changeset version --ignore pkg-a --ignore --pkg-b
  ```

### Patch Changes

- [`00e768e`](https://github.com/atlassian/changesets/commit/00e768e4af921a894debb900f944d4c9a4e27997) [#382](https://github.com/atlassian/changesets/pull/382) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Fix a bug where packages that shouldn't get released get patch releases when the pre mode is exit

- Updated dependencies [[`addd725`](https://github.com/atlassian/changesets/commit/addd7256d9251d999251a7c16c0a0b068d557b5d), [`9dcc364`](https://github.com/atlassian/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04)]:
  - @changesets/types@3.1.0

## 2.1.0

### Minor Changes

- [`6d0790a`](https://github.com/atlassian/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a) [#359](https://github.com/atlassian/changesets/pull/359) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Add support for snapshot flag to version command. Usage: `changeset version --snapshot [tag]`. The updated version of the packages looks like `0.0.0[-tag]-YYYYMMDDHHMMSS` where YYYY, MM, DD, HH, MM, and SS is the date and time of when the snapshot version is created. You can use this feature with the tag option in the publish command to publish packages under experimental tags from feature branches. To publish a snapshot version of a package under an experimental tag you can do:

  ```
  $ # Version packages to snapshot version
  $ changeset version --snapshot
  $ # Publish packages under exprimental tag, keeping next and latest tag clean
  $ changeset publish --tag exprimental
  ```

## 2.0.4

### Patch Changes

- Updated dependencies [[`2b49d66`](https://github.com/atlassian/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d)]:
  - @changesets/types@3.0.0
  - @changesets/get-dependents-graph@1.1.3

## 2.0.3

### Patch Changes

- [`8469636`](https://github.com/atlassian/changesets/commit/8469636414cb2475547bba3140e3df1927b5926b) [#344](https://github.com/atlassian/changesets/pull/344) Thanks [@zkochan](https://github.com/zkochan)! - When both a dev dep and a prod dep of a dependent package are published, the version of the dependent package should be bumped. This fixes a regression introduced by #313.

## 2.0.2

### Patch Changes

- [`d678da5`](https://github.com/atlassian/changesets/commit/d678da5e9936862bb66e5edb538c5b8be23d4ffe) [#324](https://github.com/atlassian/changesets/pull/324) Thanks [@zkochan](https://github.com/zkochan)! - Dev dependencies that are installed via the link or file protocol are ignored.

- Updated dependencies [[`d678da5`](https://github.com/atlassian/changesets/commit/d678da5e9936862bb66e5edb538c5b8be23d4ffe)]:
  - @changesets/get-dependents-graph@1.1.2

## 2.0.1

### Patch Changes

- [`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716) [#321](https://github.com/atlassian/changesets/pull/321) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix TypeScript declarations

- Updated dependencies [[`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716)]:
  - @changesets/errors@0.1.4
  - @changesets/get-dependents-graph@1.1.1
  - @changesets/types@2.0.1

## 2.0.0

### Major Changes

- [`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e) [#313](https://github.com/atlassian/changesets/pull/313) Thanks [@zkochan](https://github.com/zkochan)! - When the released package is only used as a dev dependency, the dependent package's version should not be bumped.

### Patch Changes

- Updated dependencies [[`c3cc232`](https://github.com/atlassian/changesets/commit/c3cc23204c6cb80487aced1b37ebe8ffde0e2111), [`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/get-dependents-graph@1.1.0
  - @changesets/types@2.0.0

## 1.0.1

### Patch Changes

- [`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c) [#305](https://github.com/atlassian/changesets/pull/305) Thanks [@Noviny](https://github.com/Noviny)! - Add link to changelog in readme

* [`b49e1cf`](https://github.com/atlassian/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3) [#306](https://github.com/atlassian/changesets/pull/306) Thanks [@Andarist](https://github.com/Andarist)! - Ignore `node_modules` when glob searching for packages. This fixes an issue with package cycles.

* Updated dependencies [[`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c), [`e56928b`](https://github.com/atlassian/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1), [`b49e1cf`](https://github.com/atlassian/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3)]:
  - @changesets/config@1.0.1
  - @changesets/errors@0.1.3
  - @changesets/get-dependents-graph@1.0.1
  - @changesets/types@1.0.1

## 1.0.0

### Major Changes

- [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/atlassian/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Accept `Packages` object instead of `Workspace[]` and remove `dependentsGraph` argument

### Patch Changes

- Updated dependencies [[`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/atlassian/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20)]:
  - @changesets/types@1.0.0
  - @changesets/get-dependents-graph@1.0.0
  - @changesets/config@1.0.0

## 0.3.1

### Patch Changes

- [`1282ef6`](https://github.com/atlassian/changesets/commit/1282ef698761c1f634fb409842cc7de6b4d03da4) [#263](https://github.com/atlassian/changesets/pull/263) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fixed a bug where only the unreleased pre-release changesets were taken into account when calculating the new version, not previously released changesets.

## 0.3.0

### Minor Changes

- [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/atlassian/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add support for prereleases. For more information, see [the docs on prereleases](https://github.com/atlassian/changesets/blob/master/docs/prereleases.md).

### Patch Changes

- Updated dependencies [[`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/types@0.4.0
  - @changesets/errors@0.1.2
  - @changesets/config@0.2.3

## 0.2.1

### Patch Changes

- [8c43fa0](https://github.com/atlassian/changesets/commit/8c43fa061e2a5a01e4f32504ed351d261761c8dc) [#155](https://github.com/atlassian/changesets/pull/155) Thanks [@Noviny](https://github.com/Noviny)! - Add Readme

- Updated dependencies [8c43fa0, 1ff73b7]:
  - @changesets/types@0.3.0
  - @changesets/config@0.2.1

## 0.2.0

### Minor Changes

- [296a6731](https://github.com/atlassian/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

### Patch Changes

- Updated dependencies [296a6731]:
  - @changesets/config@0.2.0
  - @changesets/types@0.2.0

## 0.1.2

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 0.1.0

### Minor Changes

- [84aeb37f](https://github.com/changesets/changesets/commit/84aeb37f) - Initial release

### Patch Changes

- [519b4218](https://github.com/changesets/changesets/commit/519b4218) - Use new Config type which makes linked required

- Updated dependencies [519b4218]:
- Updated dependencies [519b4218]:
  - @changesets/config@0.1.0
  - @changesets/types@0.1.0
