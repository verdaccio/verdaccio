# @changesets/types

## 0.4.0

### Minor Changes

- [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/atlassian/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add `PreState` type and `preState` property to `ReleasePlan`

## 0.3.1

### Patch Changes

- [`a679b1d`](https://github.com/atlassian/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/atlassian/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Correctly handle the 'access' flag for packages

  Previously, we had access as "public" or "private", access "private" isn't valid. This was a confusing because there are three states for publishing a package:

  - `private: true` - the package will not be published to npm (worked)
  - `access: public` - the package will be publicly published to npm (even if it uses a scope) (worked)
  - `access: restricted` - the package will be published to npm, but only visible/accessible by those who are part of the scope. This technically worked, but we were passing the wrong bit of information in.

  Now, we pass the correct access options `public` or `restricted`.

## 0.3.0

### Minor Changes

- [1ff73b7](https://github.com/atlassian/changesets/commit/1ff73b74f414031e49c6fd5a0f68e9974900d381) [#156](https://github.com/atlassian/changesets/pull/156) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Remove `Changeset` type because it isn't used and make commit optional on NewChangesetWithCommit because the commit won't always exist

### Patch Changes

- [8c43fa0](https://github.com/atlassian/changesets/commit/8c43fa061e2a5a01e4f32504ed351d261761c8dc) [#155](https://github.com/atlassian/changesets/pull/155) Thanks [@Noviny](https://github.com/Noviny)! - Add Readme

## 0.2.0

### Minor Changes

- [296a6731](https://github.com/atlassian/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

## 0.1.2

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 0.1.0

### Minor Changes

- [6d119893](https://github.com/changesets/changesets/commit/6d119893) - Initial Release
- [519b4218](https://github.com/changesets/changesets/commit/519b4218) - Add WrittenConfig type and include all properties in Config type
