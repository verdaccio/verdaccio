# @changesets/git

## 1.0.6

### Patch Changes

- [`1dd3117`](https://github.com/atlassian/changesets/commit/1dd311708c65321e1a1c99d36129190f940435ed) [#418](https://github.com/atlassian/changesets/pull/418) Thanks [@jonathanmorley](https://github.com/jonathanmorley)! - Don't return paths for unchanged packages

- Updated dependencies [[`a57d163`](https://github.com/atlassian/changesets/commit/a57d16355ad7d67b18b768c8f79224d80afa507c)]:
  - @changesets/types@3.1.1

## 1.0.5

### Patch Changes

- [`89f0c49`](https://github.com/atlassian/changesets/commit/89f0c497ac21b8d008da67caff8032947836c7b1) [#352](https://github.com/atlassian/changesets/pull/352) Thanks [@MichaelKapustey](https://github.com/MichaelKapustey)! - Previously packages nested inside of other packages would show both the nested package and the outer package as changed. Now, only the nested package will show as changed.

* [`09f62f9`](https://github.com/atlassian/changesets/commit/09f62f9c822f31899a48cbd93c7801d72a80b97e) [#355](https://github.com/atlassian/changesets/pull/355) Thanks [@acheronfail](https://github.com/acheronfail)! - Fix an issue where refs that didn't exist were silently ignored

* Updated dependencies [[`2b49d66`](https://github.com/atlassian/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d)]:
  - @changesets/types@3.0.0

## 1.0.4

### Patch Changes

- [`aa840db`](https://github.com/atlassian/changesets/commit/aa840db824c321159e3b1c66ea663b4036084bd7) [#336](https://github.com/atlassian/changesets/pull/336) Thanks [@MichaelKapustey](https://github.com/MichaelKapustey)! - Changed packages detection fixed on Windows.

## 1.0.3

### Patch Changes

- [`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716) [#321](https://github.com/atlassian/changesets/pull/321) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix TypeScript declarations

- Updated dependencies [[`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716)]:
  - @changesets/errors@0.1.4
  - @changesets/types@2.0.1

## 1.0.2

### Patch Changes

- Updated dependencies [[`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/types@2.0.0

## 1.0.1

### Patch Changes

- [`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c) [#305](https://github.com/atlassian/changesets/pull/305) Thanks [@Noviny](https://github.com/Noviny)! - Add link to changelog in readme

* [`b49e1cf`](https://github.com/atlassian/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3) [#306](https://github.com/atlassian/changesets/pull/306) Thanks [@Andarist](https://github.com/Andarist)! - Ignore `node_modules` when glob searching for packages. This fixes an issue with package cycles.

* Updated dependencies [[`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c), [`e56928b`](https://github.com/atlassian/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1)]:
  - @changesets/errors@0.1.3
  - @changesets/types@1.0.1

## 1.0.0

### Major Changes

- [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/atlassian/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use `@manypkg/get-packages` instead of `get-workspaces` in `getChangedPackagesSinceRef`. This means `getChangedPackagesSinceRef` now returns `Promise<Package[]>`(where `Package` is from `@manypkg/get-packages`) rather than `Promise<Workspace[]>`(where `Workspace` is from `get-workspaces`). The notable change is that `config` was renamed to `packageJson` and the package objects don't have a `name` field(use `packageJson.name` instead).

### Patch Changes

- Updated dependencies [[`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/atlassian/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf)]:
  - @changesets/types@1.0.0

## 0.4.0

### Minor Changes

- [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/atlassian/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - Read also pnpm workspace packages when searching for packages.

### Patch Changes

- Updated dependencies [[`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3), [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3)]:
  - get-workspaces@0.6.0

## 0.3.0

### Minor Changes

- [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/atlassian/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Removed `getChangedPackagesSinceMaster` and `getChangedChangesetFilesSinceMaster` and replace them with `getChangedPackagesSinceRef` and `getChangedChangesetFilesSinceRef`. The new methods along with `getChangedFilesSince` also now require arguments as an object with `cwd` and `ref` properties to avoid accidentially passing `cwd` as `ref` and vice versa

## 0.2.5

### Patch Changes

- [`b17ed74`](https://github.com/atlassian/changesets/commit/b17ed7411ea57e38b20e646321d5053b213d198a) [#216](https://github.com/atlassian/changesets/pull/216) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Get commit from the creation of a changeset rather than the last modification

## 0.2.4

### Patch Changes

- Updated dependencies [[`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/types@0.4.0
  - @changesets/errors@0.1.2
  - get-workspaces@0.5.2

## 0.2.3

### Patch Changes

- Updated dependencies [[`94de7c1`](https://github.com/atlassian/changesets/commit/94de7c1df278d63f98b599c08271ba4ef26bc3f8)]:
  - @changesets/errors@0.1.0

## 0.2.2

### Patch Changes

- [89c0894](https://github.com/atlassian/changesets/commit/89c08944fac84f71241305e359e9717ad4ec1b62) [#167](https://github.com/atlassian/changesets/pull/167) Thanks [@Noviny](https://github.com/Noviny)! - Fix broken `sinceMaster` arg - which was not working with v2 changesets

## 0.2.1

### Patch Changes

- [8c43fa0](https://github.com/atlassian/changesets/commit/8c43fa061e2a5a01e4f32504ed351d261761c8dc) [#155](https://github.com/atlassian/changesets/pull/155) Thanks [@Noviny](https://github.com/Noviny)! - Add Readme

* [0320391](https://github.com/atlassian/changesets/commit/0320391699a73621d0e51ce031062a06cbdefadc) [#163](https://github.com/atlassian/changesets/pull/163) Thanks [@Noviny](https://github.com/Noviny)! - Reordered dependencies in the package json (this should have no impact)

* Updated dependencies [8c43fa0, 1ff73b7]:
  - @changesets/types@0.3.0

## 0.2.0

### Minor Changes

- [296a6731](https://github.com/atlassian/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

### Patch Changes

- Updated dependencies [296a6731]:
  - get-workspaces@0.5.0
  - @changesets/types@0.2.0

## 0.1.2

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 0.1.0

### Minor Changes

- [6d119893](https://github.com/changesets/changesets/commit/6d119893) - Initial Release

### Patch Changes

- [c46e9ee7](https://github.com/changesets/changesets/commit/c46e9ee7) - Use 'spawndamnit' package for all new process spawning
