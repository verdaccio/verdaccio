# @changesets/cli

## 2.10.1

### Patch Changes

- [`efd01d9`](https://github.com/atlassian/changesets/commit/efd01d9b7a46ba2a44df1f5fdb47436e9219f44b) [#437](https://github.com/atlassian/changesets/pull/437) Thanks [@Blasz](https://github.com/Blasz)! - Fix version command not committing when commit config option is set

## 2.10.0

### Minor Changes

- [`dca4a91`](https://github.com/atlassian/changesets/commit/dca4a91506dfca46915f7d4e833205ad3a685aa0) [#357](https://github.com/atlassian/changesets/pull/357) Thanks [@zkochan](https://github.com/zkochan)! - Open an editor when no message is given when creating a changeset

* [`a57d163`](https://github.com/atlassian/changesets/commit/a57d16355ad7d67b18b768c8f79224d80afa507c) [#428](https://github.com/atlassian/changesets/pull/428) Thanks [@dotansimha](https://github.com/dotansimha)! - Added support for publishing from a subdirectory of packages, using `publishConfig.directory` field

### Patch Changes

- [`868eb1e`](https://github.com/atlassian/changesets/commit/868eb1e68ee91aabefa04a9abf13a7fc22eef019) [#434](https://github.com/atlassian/changesets/pull/434) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add `--no-git-checks` to `pnpm publish` in `changeset publish` to resolve issues with publishing on CI

- Updated dependencies [[`1dd3117`](https://github.com/atlassian/changesets/commit/1dd311708c65321e1a1c99d36129190f940435ed), [`a57d163`](https://github.com/atlassian/changesets/commit/a57d16355ad7d67b18b768c8f79224d80afa507c)]:
  - @changesets/git@1.0.6
  - @changesets/types@3.1.1

## 2.9.2

### Patch Changes

- [`213de26`](https://github.com/atlassian/changesets/commit/213de26502c702b9e25ac3f4a04ea8e9099a5185) [#409](https://github.com/atlassian/changesets/pull/409) Thanks [@Andarist](https://github.com/Andarist)! - Add logs for failed `JSON.parse` calls.

## 2.9.1

### Patch Changes

- [`377f5c3`](https://github.com/atlassian/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567) [#393](https://github.com/atlassian/changesets/pull/393) Thanks [@Andarist](https://github.com/Andarist)! - Fixed an issue with experimental flags being written to disk as part of the default config when initializing Changesets.

- Updated dependencies [[`377f5c3`](https://github.com/atlassian/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567), [`377f5c3`](https://github.com/atlassian/changesets/commit/377f5c385ad9db4ff8458f159e2d452c39828567)]:
  - @changesets/config@1.3.0

## 2.9.0

### Minor Changes

- [`9006375`](https://github.com/atlassian/changesets/commit/90063752a4c4f187fcb3dc30c833405f209d9c84) [#392](https://github.com/atlassian/changesets/pull/392) Thanks [@Andarist](https://github.com/Andarist)! - Changed condition based on which single-package repositories are identified when creating tags after successful publish. It is now based on whether we have recognized the repository to be managed by monorepo tooling or not.

* [`9dcc364`](https://github.com/atlassian/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04) [#371](https://github.com/atlassian/changesets/pull/371) Thanks [@Feiyang1](https://github.com/Feiyang1)! - Added support for ignoring packages in the `version` command. The version of ignored packages will not be bumped, but their dependencies will still be bumped normally. This is useful when you have private packages, e.g. packages under development. It allows you to make releases for the public packages without changing the version of your private packages. To use the feature, you can define the `ignore` array in the config file with the name of the packages:

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

- Updated dependencies [[`00e768e`](https://github.com/atlassian/changesets/commit/00e768e4af921a894debb900f944d4c9a4e27997), [`addd725`](https://github.com/atlassian/changesets/commit/addd7256d9251d999251a7c16c0a0b068d557b5d), [`9dcc364`](https://github.com/atlassian/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04), [`9dcc364`](https://github.com/atlassian/changesets/commit/9dcc364bf19e48f8f2824ebaf967d9ef41b6fc04)]:
  - @changesets/assemble-release-plan@3.0.0
  - @changesets/apply-release-plan@4.0.0
  - @changesets/get-release-plan@2.0.0
  - @changesets/config@1.2.0
  - @changesets/types@3.1.0

## 2.8.0

### Minor Changes

- [`6d0790a`](https://github.com/atlassian/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a) [#359](https://github.com/atlassian/changesets/pull/359) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Add support for snapshot flag to version command. Usage: `changeset version --snapshot [tag]`. The updated version of the packages looks like `0.0.0[-tag]-YYYYMMDDHHMMSS` where YYYY, MM, DD, HH, MM, and SS is the date and time of when the snapshot version is created. You can use this feature with the tag option in the publish command to publish packages under experimental tags from feature branches. To publish a snapshot version of a package under an experimental tag you can do:

  ```
  $ # Version packages to snapshot version
  $ changeset version --snapshot
  $ # Publish packages under exprimental tag, keeping next and latest tag clean
  $ changeset publish --tag exprimental
  ```

* [`6d0790a`](https://github.com/atlassian/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a) [#359](https://github.com/atlassian/changesets/pull/359) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Add support for tag flag to publish command. Usage: `changeset publish --tag <tag>`. This will publish the packages under passed npm tag.

* [`5dc389f`](https://github.com/atlassian/changesets/commit/5dc389f9cc03a59ef44f34243efe8ad00e35d465) [#376](https://github.com/atlassian/changesets/pull/376) Thanks [@Andarist](https://github.com/Andarist)! - Changed what git tag is generated for single-package repositories after successful publish. The package name is being skipped and the scheme matches what `npm version` generates, so for example `v2.8.0`.

### Patch Changes

- Updated dependencies [[`6d0790a`](https://github.com/atlassian/changesets/commit/6d0790a7aa9f00e350e9394f419e4b3c7ee7ca6a)]:
  - @changesets/apply-release-plan@3.1.0
  - @changesets/assemble-release-plan@2.1.0

## 2.7.2

### Patch Changes

- [`8040173`](https://github.com/atlassian/changesets/commit/80401737fddfc687f15e3d71dec967a6498317ea) [#368](https://github.com/atlassian/changesets/pull/368) Thanks [@Andarist](https://github.com/Andarist)! - When logging successful releases and creating tags include an information about those being git tags.

* [`90f3b65`](https://github.com/atlassian/changesets/commit/90f3b651f9c0403920b17801b84a2fbe6f190e2a) [#373](https://github.com/atlassian/changesets/pull/373) Thanks [@Blasz](https://github.com/Blasz)! - Fix patch bumped dependencies not being updated in dependents package.json when leaving semver range with `updateInternalDependencies` set to minor.

* Updated dependencies [[`90f3b65`](https://github.com/atlassian/changesets/commit/90f3b651f9c0403920b17801b84a2fbe6f190e2a)]:
  - @changesets/apply-release-plan@3.0.3

## 2.7.1

### Patch Changes

- [`52a88ce`](https://github.com/atlassian/changesets/commit/52a88ce816692f6b18fa8f3f67d707b78b0b8210) [#361](https://github.com/atlassian/changesets/pull/361) Thanks [@Blasz](https://github.com/Blasz)! - Fix dependency release lines being output when they were skipped via the updateInternalDependencies config option

- Updated dependencies [[`52a88ce`](https://github.com/atlassian/changesets/commit/52a88ce816692f6b18fa8f3f67d707b78b0b8210)]:
  - @changesets/apply-release-plan@3.0.1

## 2.7.0

### Minor Changes

- [`2b49d66`](https://github.com/atlassian/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d) [#358](https://github.com/atlassian/changesets/pull/358) Thanks [@Blasz](https://github.com/Blasz)! - Add new config option 'updateInternalDependencies' that can be set to 'minor' to only update internal dependencies in the same release if the dependency was minor released or above. Defaults to 'patch' which is the existing behaviour.

### Patch Changes

- Updated dependencies [[`89f0c49`](https://github.com/atlassian/changesets/commit/89f0c497ac21b8d008da67caff8032947836c7b1), [`2b49d66`](https://github.com/atlassian/changesets/commit/2b49d668ecaa1333bc5c7c5be4648dda1b11528d), [`09f62f9`](https://github.com/atlassian/changesets/commit/09f62f9c822f31899a48cbd93c7801d72a80b97e)]:
  - @changesets/git@1.0.5
  - @changesets/apply-release-plan@3.0.0
  - @changesets/types@3.0.0
  - @changesets/config@1.1.0
  - @changesets/assemble-release-plan@2.0.4
  - @changesets/get-release-plan@1.0.4
  - @changesets/pre@1.0.4
  - @changesets/read@0.4.6
  - @changesets/write@0.1.3

## 2.6.5

### Patch Changes

- [`d570a24`](https://github.com/atlassian/changesets/commit/d570a24740a374a9547dd7d931e6ac854e36a9fb) [#328](https://github.com/atlassian/changesets/pull/328) Thanks [@zkochan](https://github.com/zkochan)! - Use pnpm inside a pnpm workspace. Previously, pnpm was detected properly only in projects that use one lockfile per project. However, by default pnpm creates a single lockfile per workspace.

- Updated dependencies [[`d678da5`](https://github.com/atlassian/changesets/commit/d678da5e9936862bb66e5edb538c5b8be23d4ffe)]:
  - @changesets/assemble-release-plan@2.0.2

## 2.6.4

### Patch Changes

- Updated dependencies [[`1706fb7`](https://github.com/atlassian/changesets/commit/1706fb751ecc2f5a792c42f467b2063078d58716)]:
  - @changesets/apply-release-plan@2.0.1
  - @changesets/assemble-release-plan@2.0.1
  - @changesets/config@1.0.3
  - @changesets/errors@0.1.4
  - @changesets/get-release-plan@1.0.3
  - @changesets/git@1.0.3
  - @changesets/logger@0.0.5
  - @changesets/pre@1.0.3
  - @changesets/read@0.4.5
  - @changesets/types@2.0.1
  - @changesets/write@0.1.2

## 2.6.3

### Patch Changes

- [`9cdfa36`](https://github.com/atlassian/changesets/commit/9cdfa36f831cca2b11593881671410a6d2f0b546) [#318](https://github.com/atlassian/changesets/pull/318) Thanks [@Noviny](https://github.com/Noviny)! - Typo fix in prerelease warning message

- Updated dependencies [[`44555b4`](https://github.com/atlassian/changesets/commit/44555b44cac843d973d31adbfc7703f45117d204), [`c3cc232`](https://github.com/atlassian/changesets/commit/c3cc23204c6cb80487aced1b37ebe8ffde0e2111), [`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e), [`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e), [`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e), [`011d57f`](https://github.com/atlassian/changesets/commit/011d57f1edf9e37f75a8bef4f918e72166af096e)]:
  - @changesets/apply-release-plan@2.0.0
  - @changesets/assemble-release-plan@2.0.0
  - @changesets/types@2.0.0
  - @changesets/get-release-plan@1.0.2
  - @changesets/config@1.0.2
  - @changesets/git@1.0.2
  - @changesets/pre@1.0.2
  - @changesets/read@0.4.4
  - @changesets/write@0.1.1

## 2.6.2

### Patch Changes

- [`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c) [#305](https://github.com/atlassian/changesets/pull/305) Thanks [@Noviny](https://github.com/Noviny)! - Add link to changelog in readme

* [`b49e1cf`](https://github.com/atlassian/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3) [#306](https://github.com/atlassian/changesets/pull/306) Thanks [@Andarist](https://github.com/Andarist)! - Ignore `node_modules` when glob searching for packages. This fixes an issue with package cycles.

* Updated dependencies [[`04ddfd7`](https://github.com/atlassian/changesets/commit/04ddfd7c3acbfb84ef9c92873fe7f9dea1f5145c), [`e56928b`](https://github.com/atlassian/changesets/commit/e56928bbd6f9096def06ac37487bdbf28efec9d1), [`b49e1cf`](https://github.com/atlassian/changesets/commit/b49e1cff65dca7fe9e341a35aa91704aa0e51cb3)]:
  - @changesets/apply-release-plan@1.0.1
  - @changesets/assemble-release-plan@1.0.1
  - @changesets/config@1.0.1
  - @changesets/errors@0.1.3
  - @changesets/get-release-plan@1.0.1
  - @changesets/git@1.0.1
  - @changesets/logger@0.0.4
  - @changesets/parse@0.3.3
  - @changesets/pre@1.0.1
  - @changesets/read@0.4.3
  - @changesets/test-utils@0.0.4
  - @changesets/types@1.0.1

## 2.6.1

### Patch Changes

- [`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997) [#292](https://github.com/atlassian/changesets/pull/292) Thanks [@acheronfail](https://github.com/acheronfail)! - Use `@changesets/write` for writing changesets internally

* [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/atlassian/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use `@manypkg/get-packages` instead of `get-workspaces` internally

- [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20) [#290](https://github.com/atlassian/changesets/pull/290) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Don't show `all packages` in list of selected packages in major and minor questions in `add` command after the question is answered

- Updated dependencies [[`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`2363366`](https://github.com/atlassian/changesets/commit/2363366756d1b15bddf6d803911baccfca03cbdf), [`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`41e2e3d`](https://github.com/atlassian/changesets/commit/41e2e3dd1053ff2f35a1a07e60793c9099f26997), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20), [`cc8c921`](https://github.com/atlassian/changesets/commit/cc8c92143d4c4b7cca8b9917dfc830a40b5cda20)]:
  - @changesets/types@1.0.0
  - @changesets/git@1.0.0
  - @changesets/pre@1.0.0
  - @changesets/get-release-plan@1.0.0
  - @changesets/apply-release-plan@1.0.0
  - @changesets/parse@0.3.2
  - @changesets/write@0.1.0
  - @changesets/config@1.0.0
  - @changesets/assemble-release-plan@1.0.0
  - @changesets/read@0.4.2

## 2.6.0

### Minor Changes

- [`ca934d7`](https://github.com/atlassian/changesets/commit/ca934d7b9dcd3203f27a4a2cefb19e9cb90cb083) [#282](https://github.com/atlassian/changesets/pull/282) Thanks [@tarang9211](https://github.com/tarang9211)! - Add all packages option to major and minor selects

### Patch Changes

- [`2adfe66`](https://github.com/atlassian/changesets/commit/2adfe66252f9b8b7a6a0c261f608dcb3c9294bfb) [#288](https://github.com/atlassian/changesets/pull/288) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Stop running `npm profile get` when using non-npm registries

- Updated dependencies []:
  - @changesets/apply-release-plan@0.4.2

## 2.5.2

### Patch Changes

- [`184a653`](https://github.com/atlassian/changesets/commit/184a653de2d050f877b91d0ad319f00683bbc7ff) [#278](https://github.com/atlassian/changesets/pull/278) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use a single prompt for the semver version type when there is only a single package in the repo in `changeset add`

  ![changeset add command with single package repo](https://user-images.githubusercontent.com/11481355/75123292-40f78f00-56fa-11ea-9e16-fe3f5e2d9cf5.gif)

## 2.5.1

### Patch Changes

- [`1282ef6`](https://github.com/atlassian/changesets/commit/1282ef698761c1f634fb409842cc7de6b4d03da4) [#263](https://github.com/atlassian/changesets/pull/263) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fixed a bug where only the unreleased pre-release changesets were taken into account when calculating the new version, not previously released changesets.

- Updated dependencies [[`1282ef6`](https://github.com/atlassian/changesets/commit/1282ef698761c1f634fb409842cc7de6b4d03da4)]:
  - @changesets/assemble-release-plan@0.3.1
  - @changesets/apply-release-plan@0.4.1

## 2.5.0

### Minor Changes

- [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/atlassian/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - When in pnpm-managed project use pnpm for publishing.

* [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3) [#236](https://github.com/atlassian/changesets/pull/236) Thanks [@Andarist](https://github.com/Andarist)! - Read also pnpm workspace packages when searching for packages.

### Patch Changes

- [`cc64ad52`](https://github.com/atlassian/changesets/commit/cc64ad52ef334ba77efb61ed8cd4b2f4abd2a668) [#254](https://github.com/atlassian/changesets/pull/254) Thanks [@Andarist](https://github.com/Andarist)! - Added GitHub Actions support to CI detection.

* [`4af2a78b`](https://github.com/atlassian/changesets/commit/4af2a78b22a2d22b557fe21603c83cc99959773d) [#232](https://github.com/atlassian/changesets/pull/232) Thanks [@harrysolovay](https://github.com/harrysolovay)! - Change format of the automatic commit messages to be in line with conventional commits.

- [`ef6402c9`](https://github.com/atlassian/changesets/commit/ef6402c9d8dc1832126732dbbafb015b71f57f83) [#252](https://github.com/atlassian/changesets/pull/252) Thanks [@Andarist](https://github.com/Andarist)! - Avoid trailing newline for single-line changesets to avoid double newline between release lines when generating final markdown for changelog.

- Updated dependencies [[`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3), [`ef6402c9`](https://github.com/atlassian/changesets/commit/ef6402c9d8dc1832126732dbbafb015b71f57f83), [`fe0d9192`](https://github.com/atlassian/changesets/commit/fe0d9192544646e1a755202b87dfe850c1c200a3), [`503154db`](https://github.com/atlassian/changesets/commit/503154db39fe8ab88a1176e4569c48078bcf5569)]:
  - get-workspaces@0.6.0
  - @changesets/apply-release-plan@0.4.0
  - get-dependents-graph@0.2.0
  - @changesets/get-release-plan@0.4.0
  - @changesets/git@0.4.0
  - @changesets/pre@0.2.0
  - @changesets/read@0.4.1

## 2.4.1

### Patch Changes

- [`6c0b53d`](https://github.com/atlassian/changesets/commit/6c0b53da63f287dfa9af45532f1f1d628b518b25) [#227](https://github.com/atlassian/changesets/pull/227) - Fix received typo

## 2.4.0

### Minor Changes

- [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/atlassian/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Added support for `baseBranch` option which specifies what branch Changesets should use when determining what packages have changed

* [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/atlassian/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Added support for `--since` option to the `status` command which shows the release plan since the git ref(branch, tag, commit, etc.) specified with `--since` and deprecate `--sinceMaster` option

### Patch Changes

- [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/atlassian/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Moved error advising users to run changeset init when a .changeset directory from the add command to all commands except init

* [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2) [#221](https://github.com/atlassian/changesets/pull/221) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fixed old changesets not being read in status command
* Updated dependencies [[`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2), [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2), [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2), [`bca8865`](https://github.com/atlassian/changesets/commit/bca88652d38caa31e789c4564230ba0b49562ad2)]:
  - @changesets/get-release-plan@0.3.0
  - @changesets/read@0.4.0
  - @changesets/config@0.3.0
  - @changesets/git@0.3.0
  - @changesets/apply-release-plan@0.3.1

## 2.3.3

### Patch Changes

- [`9cd1eaf`](https://github.com/atlassian/changesets/commit/9cd1eafc1620894a39fe10d3e393ad8f812df53a) [#214](https://github.com/atlassian/changesets/pull/214) Thanks [@Noviny](https://github.com/Noviny)! - Remove unused dependencies
- Updated dependencies [[`9cd1eaf`](https://github.com/atlassian/changesets/commit/9cd1eafc1620894a39fe10d3e393ad8f812df53a), [`b17ed74`](https://github.com/atlassian/changesets/commit/b17ed7411ea57e38b20e646321d5053b213d198a)]:
  - @changesets/logger@0.0.3
  - @changesets/pre@0.1.1
  - @changesets/test-utils@0.0.3
  - @changesets/git@0.2.5
  - @changesets/config@0.2.4

## 2.3.2

### Patch Changes

- [`7c1269de`](https://github.com/atlassian/changesets/commit/7c1269de31f02c731fdb69d7be037b83e12a0445) Thanks [@Noviny](https://github.com/Noviny)! - Fix previous version not having correctly built dists

## 2.3.1

### Patch Changes

- [`a0b5dba`](https://github.com/atlassian/changesets/commit/a0b5dba3fe59d2b2e856173e40b936e56ab74ac6) [#209](https://github.com/atlassian/changesets/pull/209) Thanks [@ryanbraganza](https://github.com/ryanbraganza)! - Skip OTP check during isCI

## 2.3.0

### Minor Changes

- [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/atlassian/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add support for prereleases. Prereleases work with two new commands, `pre enter` and `pre exit` along with changes to `version` and `exit`. For more information, see [the docs on prereleases](https://github.com/atlassian/changesets/blob/master/docs/prereleases.md).

### Patch Changes

- [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/atlassian/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add `InternalError` for errors which are unexpected and if they occur, an issue should be opened. The CLI catches the error and logs a link for users to open an issue with the error and versions of Node and Changesets filled in

* [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0) [#183](https://github.com/atlassian/changesets/pull/183) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Always publish packages if they don't exist on npm rather than only if they are a greater version than the latest version on npm
* Updated dependencies [[`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0), [`8f0a1ef`](https://github.com/atlassian/changesets/commit/8f0a1ef327563512f471677ef0ca99d30da009c0)]:
  - @changesets/assemble-release-plan@0.3.0
  - @changesets/apply-release-plan@0.3.0
  - @changesets/get-release-plan@0.2.0
  - @changesets/types@0.4.0
  - @changesets/errors@0.1.2
  - @changesets/pre@0.1.0
  - @changesets/config@0.2.3
  - get-dependents-graph@0.1.2
  - get-workspaces@0.5.2
  - @changesets/git@0.2.4
  - @changesets/logger@0.0.2
  - @changesets/parse@0.3.1
  - @changesets/read@0.3.1
  - @changesets/test-utils@0.0.2

## 2.2.0

### Minor Changes

- [`a679b1d`](https://github.com/atlassian/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/atlassian/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Respect `publishConfig.access` in workspace package.jsons

  Previously, every package in your repository had one 'public' or 'restricted' setting.

  Now, if a workspace has `publishConfig.access` in its package.json, we will prioritize it over the global changesets config.

- [`51a0d76`](https://github.com/atlassian/changesets/commit/51a0d766c7064b4c6a9d1490593522c6fcd02929) [#182](https://github.com/atlassian/changesets/pull/182) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Updated the package to use the new `@changesets/logger` for logging.

### Patch Changes

- [`5ababa0`](https://github.com/atlassian/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27) [#201](https://github.com/atlassian/changesets/pull/201) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Updated to use the Error classes from the @changesets/errors package

* [`a679b1d`](https://github.com/atlassian/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62) [#204](https://github.com/atlassian/changesets/pull/204) Thanks [@Andarist](https://github.com/Andarist)! - Correctly handle the 'access' flag for packages

  Previously, we had access as "public" or "private", access "private" isn't valid. This was a confusing because there are three states for publishing a package:

  - `private: true` - the package will not be published to npm (worked)
  - `access: public` - the package will be publicly published to npm (even if it uses a scope) (worked)
  - `access: restricted` - the package will be published to npm, but only visible/accessible by those who are part of the scope. This technically worked, but we were passing the wrong bit of information in.

  Now, we pass the correct access options `public` or `restricted`.

* [`da11ab8`](https://github.com/atlassian/changesets/commit/da11ab8a4e4324a7023d12f990beec8c3b6ae35f) [#205](https://github.com/atlassian/changesets/pull/205) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Don't update ranges set to \*/x/X when versioning

* Updated dependencies [[`51a0d76`](https://github.com/atlassian/changesets/commit/51a0d766c7064b4c6a9d1490593522c6fcd02929), [`5ababa0`](https://github.com/atlassian/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27), [`a679b1d`](https://github.com/atlassian/changesets/commit/a679b1dcdcb56652d31536e2d6326ba02a9dfe62), [`5ababa0`](https://github.com/atlassian/changesets/commit/5ababa08c8ea5ee3b4ff92253e2e752a5976cd27), [`da11ab8`](https://github.com/atlassian/changesets/commit/da11ab8a4e4324a7023d12f990beec8c3b6ae35f)]:
  - @changesets/logger@0.0.1
  - @changesets/test-utils@0.0.1
  - @changesets/config@0.2.2
  - @changesets/apply-release-plan@0.2.3
  - get-workspaces@0.5.1
  - @changesets/types@0.3.1
  - @changesets/errors@0.1.1

## 2.1.2

### Patch Changes

- Remove console log
- When 2fa token is wrong (ie, it has expired) reprompt instead of failing

## 2.1.1

### Patch Changes

- [`71a0193`](https://github.com/atlassian/changesets/commit/71a0193939b13f693d3652c01a82a67a6be5e104) [#197](https://github.com/atlassian/changesets/pull/197) Thanks [@Noviny](https://github.com/Noviny)! - Close off error when running publish where individual packages have pre or post hooks.

  Under the previous behaviour, JSON parsing the response to publish failed, causing git tags to not be created.

## 2.1.0

### Minor Changes

- [`8dce96f`](https://github.com/atlassian/changesets/commit/8dce96f8aec43f82b35e65f54b06cbeed3275885) [#187](https://github.com/atlassian/changesets/pull/187) Thanks [@gardnerjack](https://github.com/gardnerjack)! - Added --empty flag to the add command for empty changeset files. New tests for adding, writing, parsing, and reading empty changesets.

### Patch Changes

- [`7e2fc8e`](https://github.com/atlassian/changesets/commit/7e2fc8ee58be3be3452358cc7852412fbec0f995) [#184](https://github.com/atlassian/changesets/pull/184) Thanks [@Noviny](https://github.com/Noviny)! - Fix message on warning if 'add' command is run before changesets has been initialised.

- Updated dependencies [[`8dce96f`](https://github.com/atlassian/changesets/commit/8dce96f8aec43f82b35e65f54b06cbeed3275885)]:
  - @changesets/parse@0.3.0
  - @changesets/read@0.3.0
  - @changesets/get-release-plan@0.1.3

## 2.0.4

### Patch Changes

- [`f63b652`](https://github.com/atlassian/changesets/commit/f63b6521d2b20c61526c7e31ddf18c4b480b456f) [#176](https://github.com/atlassian/changesets/pull/176) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Change the log type of the default config writing message from `error` to `info` because the message isn't an error

* [`df35f32`](https://github.com/atlassian/changesets/commit/df35f32f3844d34ed2bb2ee4a41495a88fd191a9) [#179](https://github.com/atlassian/changesets/pull/179) Thanks [@ryanbraganza](https://github.com/ryanbraganza)! - Remove dependency on uuid

- [`94de7c1`](https://github.com/atlassian/changesets/commit/94de7c1df278d63f98b599c08271ba4ef26bc3f8) [#173](https://github.com/atlassian/changesets/pull/173) Thanks [@ajaymathur](https://github.com/ajaymathur)! - Catch errors from git being absent and continue on as best possible

* [`72babcb`](https://github.com/atlassian/changesets/commit/72babcbccbdd41618d9cb90b2a8871fe63643601) [#178](https://github.com/atlassian/changesets/pull/178) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix changelog generator options not being provided

* Updated dependencies [[`72babcb`](https://github.com/atlassian/changesets/commit/72babcbccbdd41618d9cb90b2a8871fe63643601)]:
  - @changesets/apply-release-plan@0.2.2
  - @changesets/git@0.2.3

## 2.0.3

### Patch Changes

- [89c0894](https://github.com/atlassian/changesets/commit/89c08944fac84f71241305e359e9717ad4ec1b62) [#167](https://github.com/atlassian/changesets/pull/167) Thanks [@Noviny](https://github.com/Noviny)! - Fix broken `--since-master` flag (which was broken by the move to v2 changesets)

- Updated dependencies [89c0894]:
  - @changesets/git@0.2.2
  - @changesets/get-release-plan@0.1.2
  - @changesets/read@0.2.2

## 2.0.2

### Patch Changes

- [1ff73b7](https://github.com/atlassian/changesets/commit/1ff73b74f414031e49c6fd5a0f68e9974900d381) [#156](https://github.com/atlassian/changesets/pull/156) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix commits not being obtained for old changesets

* [0320391](https://github.com/atlassian/changesets/commit/0320391699a73621d0e51ce031062a06cbdefadc) [#163](https://github.com/atlassian/changesets/pull/163) Thanks [@Noviny](https://github.com/Noviny)! - Reordered dependencies in the package json (this should have no impact)

* Updated dependencies [3dd003c, 1ff73b7, 8c43fa0, 0320391, 1ff73b7]:
  - @changesets/get-release-plan@0.1.1
  - @changesets/apply-release-plan@0.2.1
  - @changesets/assemble-release-plan@0.2.1
  - get-dependents-graph@0.1.1
  - @changesets/git@0.2.1
  - @changesets/parse@0.2.1
  - @changesets/read@0.2.1
  - @changesets/types@0.3.0
  - @changesets/config@0.2.1

## 2.0.1

### Patch Changes

- [62873042](https://github.com/atlassian/changesets/commit/62873042) [#153](https://github.com/atlassian/changesets/pull/153) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Make init write the default config file if it doesn't exist with a special message if an old config file exists

- [85f837a7](https://github.com/atlassian/changesets/commit/85f837a7) [#150](https://github.com/atlassian/changesets/pull/150) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix init command from crashing because it was trying to access a config that doesn't exist

* [709493b4](https://github.com/atlassian/changesets/commit/709493b4) - Fix version always removing legacy changesets even when the commit option is false

- [16cb2ff3](https://github.com/atlassian/changesets/commit/16cb2ff3) [#151](https://github.com/atlassian/changesets/pull/151) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Include changelog directory in published files

## 2.0.0

Welcome to version 2 🎉🦋

Quickest summary of the most exciting changes:

🦋 Changesets (the written files) have a new format! They are now human readable/writeable

🦋 The config options have been completely rethought to be clearer and more concise

🦋 Changesets has been significantly decomposed, allowing an easier time building tools on top of it

### Major Changes

- [ca8ff585](https://github.com/atlassian/changesets/commit/ca8ff585) [#147](https://github.com/atlassian/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

  #### Changed command line argument names

  We have removed command line arguments that overrwrite the config. The following commands can no longer
  be passed in:

  - `updateChangelog`
  - `isPublic`
  - `skipCI`
  - `commit`

  This has been done to avoid overloading the number of ways you can pass options, as within any single
  repository, there should be a single consistent way in which these values are always provided.

- [ca8ff585](https://github.com/atlassian/changesets/commit/ca8ff585) [#147](https://github.com/atlassian/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

  #### Changed how Config works

  The Changesets config is now written in JSON with fewer options. The new defaults are shown below.

  ```json
  {
    "$schema": "https://unpkg.com/@changesets/config/schema.json",
    "changelog": "@changesets/cli/changelog",
    "commit": false,
    "linked": [],
    "access": "private"
  }
  ```

  **Reasoning**: Having a JSON config makes it easier to build other tools on changesets because the config can be read without executing user code that could potentially be unsafe. It also means we can have easy autocompletion and descriptions in editors that don't go out of date like the comments in the JS config along with being able to packagise changelog entry generators.

  ##### Migrating

  1. Run `yarn changeset init` to create a config file in the new format at `.changeset/config.json`
  1. If you're using changelogs, move `getReleaseLine` and `getDependencyReleaseLine` to their own module and set the changelog option to the path to the module. If you're not using changelogs, set the changelog option to `false`. In the future, we will be providing packages to write changelogs for common use cases
  1. Set `access` to `"public"` if `publishOptions.public` is `true`, otherwise set it to `"private"`
  1. If you use `linked`, copy your linked package groups from the JS config to the the JSON file
  1. If you use `commit` and `skipCI` in `versionOptions` or `publishOptions`, set commit to `true`, all commits will include a skip ci message. if you have a use case for only using commit on one command or not including a skip ci message by default, contact us and we will talk about re-implementing these features.
  1. Delete `.changeset/config.js`

- [ca8ff585](https://github.com/atlassian/changesets/commit/ca8ff585) [#147](https://github.com/atlassian/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

  #### Changelog generation functions have minor changes

  In addition to how these functions are defined (see changes to config), the data that is passed through
  to these functions is notably different to what it was before. For the most part, the changelog functions
  simply receive richer information, based on the new changelog format.

  **BREAKING**: The release objects and dependency release objects now use `release.newVersion` for the latest
  version, instead of the previous `release.version`.

  The `@changesets/types` package includes exports for both `GetReleaseLine` as well as `GetDependencyReleaseLine`.

  If you were using the default changelog generation scripts, you won't need to worry. Otherwise, we recommend updating
  your command and manually running `version` to ensure you are still getting the changelogs you expect.

  **Looking further forward** We are already aware that we want to change how people write these generation functions,
  including opening up more flexibility, and access to things such as the underlying release plan. This will likely require
  a breaking change in the future, but we thought we were changing enough this release that we didn't want too much turmoil. 😁

- [ca8ff585](https://github.com/atlassian/changesets/commit/ca8ff585) [#147](https://github.com/atlassian/changesets/pull/147) Thanks [@Noviny](https://github.com/Noviny)!

  #### Renamed commands

  - `bump` has been renamed to `version`
  - `release` has been renamed to `publish`

  This is a reversion to the changes made in `1.0.0`.

  **Reasoning**: We switched the names because we wanted to avoid confusion with the related
  tasks in npm. While technically it removed confusion that this was doing the same thing as
  `npm version`, or `npm publish`, the new terms did not convey easily grokkable meanings. As
  we weren't benefiting from the new names, we have decided to revert to names that have more
  meaning within the community, even though these commands do slightly more than this.

### Minor Changes

- [296a6731](https://github.com/atlassian/changesets/commit/296a6731) - Safety bump: Towards the end of preparing changesets v2, there was a lot of chaos - this bump is to ensure every package on npm matches what is found in the repository.

### Patch Changes

- Updated dependencies [ca8ff585, 296a6731]:
  - @changesets/get-release-plan@0.1.0
  - @changesets/apply-release-plan@0.2.0
  - @changesets/assemble-release-plan@0.2.0
  - @changesets/config@0.2.0
  - get-dependents-graph@0.1.0
  - get-workspaces@0.5.0
  - @changesets/git@0.2.0
  - @changesets/parse@0.2.0
  - @changesets/read@0.2.0
  - @changesets/types@0.2.0

## 1.3.3

### Patch Changes

- [a15abbf9](https://github.com/changesets/changesets/commit/a15abbf9) - Previous release shipped unbuilt code - fixing that

## 1.3.1

### Patch Changes

- [c46e9ee7](https://github.com/changesets/changesets/commit/c46e9ee7) - Use 'spawndamnit' package for all new process spawning
- [5b28c527](https://github.com/changesets/changesets/commit/5b28c527) - Fix 2FA check on release
- [6f8eb05a](https://github.com/changesets/changesets/commit/6f8eb05a) - Updated readme
- [6d119893](https://github.com/changesets/changesets/commit/6d119893) - Move `git` module to be its own external module

## 1.3.0

### Minor Changes

- [e55fa3f0](https://github.com/changesets/changesets/commit/e55fa3f0) [#92](https://github.com/changesets/changesets/pull/92) Thanks [@highvoltag3](https://github.com/highvoltag3)! - Catch Promise rejection on SIGINT and exit gracefully
- [94267ff3](https://github.com/changesets/changesets/commit/94267ff3) [#106](https://github.com/changesets/changesets/pull/106) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Improve 2FA support for publishing:

  - Prompt for an OTP code when required
  - Add `--otp` option to release command

### Patch Changes

- [a700de81](https://github.com/changesets/changesets/commit/a700de81) [#104](https://github.com/changesets/changesets/pull/104) Thanks [@Noviny](https://github.com/Noviny)! - Fix auto-generated documentation to point outwards to changesets repo to stop it going stale
- [94267ff3](https://github.com/changesets/changesets/commit/94267ff3) [#106](https://github.com/changesets/changesets/pull/106) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Inline last usages of bolt
- [d4bbab4e](https://github.com/changesets/changesets/commit/d4bbab4e) [#91](https://github.com/changesets/changesets/pull/91) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Convert some internals to TypeScript
- [fc32bc11](https://github.com/changesets/changesets/commit/fc32bc11) [#94](https://github.com/changesets/changesets/pull/94) Thanks [@Noviny](https://github.com/Noviny)! - Better Docs in readme

- Updated dependencies [cbb2c953]:
  - get-workspaces@0.4.0

## 1.2.0

### Minor Changes

- [16fde2e0](https://github.com/changesets/changesets/commit/16fde2e0) [#75](https://github.com/changesets/changesets/pull/75) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Use [enquirer](https://github.com/enquirer/enquirer) instead of inquirer for asking questions because it's smaller, faster and prettier.
  Change bump type questions from asking for each bump type individually per package to asking users to two questions where the user selects what packages should have major and minor bumps and the packages left are assumed to be patch bumps. This dramatically cuts down the amount of time it takes to create a changeset with a large number of packages.

  ![example of using the CLI with the new questions](https://user-images.githubusercontent.com/11481355/58873398-a1c4de80-8709-11e9-80e8-16061e395b15.gif)

### Patch Changes

- [20da7747](https://github.com/changesets/changesets/commit/20da7747) [#66](https://github.com/changesets/changesets/pull/66) Thanks [@Noviny](https://github.com/Noviny)! - Update package.json field so each links into its own package
- [29ff34ed](https://github.com/changesets/changesets/commit/29ff34ed) [#82](https://github.com/changesets/changesets/pull/82) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Limit the number of rows the package selection question takes up so that the question is still visible in repos with a very large number of packages

  ![changeset package question in atlaskit](https://user-images.githubusercontent.com/11481355/59012109-ff783880-8879-11e9-9b68-77ab672921fa.png)

- [ef9be2df](https://github.com/changesets/changesets/commit/ef9be2df) [#81](https://github.com/changesets/changesets/pull/81) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix tables in status command from flowing over to the next line

  ![changeset status --verbose output](https://user-images.githubusercontent.com/11481355/59011589-875d4300-8878-11e9-9e69-cada41f83261.png)

- [91000292](https://github.com/changesets/changesets/commit/91000292) [#78](https://github.com/changesets/changesets/pull/78) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix misaligned CLI messages

## 1.1.5

### Patch Changes

- [7fa42641](https://github.com/changesets/changesets/commit/7fa42641) [#61](https://github.com/changesets/changesets/pull/61) Thanks [@Noviny](https://github.com/Noviny)! - When bumping, run prettier over the changelog file.

  If you want this option turned off, add `disabledLanguage: ["markdown"] to your prettier config.

  - [6dc510f4](https://github.com/changesets/changesets/commit/6dc510f4) [#62](https://github.com/changesets/changesets/pull/62) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add butterfly emoji prefix to CLI output

## 1.1.4

### Patch Changes

- [83ba6d3f](https://github.com/Noviny/changesets/commit/83ba6d3f) - Convert various modules to TypeScript
- [a966701d](https://github.com/Noviny/changesets/commit/a966701d) - Add repository information to package.json
- [c00e65ef](https://github.com/Noviny/changesets/commit/c00e65ef) - Fix bug where unprovided command line options overrode the config file, leading to incorrect states
- [8d2e700c](https://github.com/Noviny/changesets/commit/8d2e700c) - Remove unused function parseChangesetCommit
- [7399648d](https://github.com/Noviny/changesets/commit/7399648d) - Make ids human readable

- Updated dependencies [83ba6d3f]:
  - get-workspaces@0.3.0

## 1.1.3

### Patch Changes

- [67db935d](https://github.com/Noviny/changesets/commit/67db935d) - Fix release without built files

## 1.1.2

### Patch Changes

- [c6f1c7b7](https://github.com/Noviny/changesets/commit/c6f1c7b7) [#46](https://github.com/Noviny/changesets/pull/46) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Convert a file to TypeScript
- [9fe9ecff](https://github.com/Noviny/changesets/commit/9fe9ecff) [#45](https://github.com/Noviny/changesets/pull/45) Thanks [@Noviny](https://github.com/Noviny)! - Print out the last changes.md path in terminal as last step of adding a changeset
- [61ac9ce7](https://github.com/Noviny/changesets/commit/61ac9ce7) [#42](https://github.com/Noviny/changesets/pull/42) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Make "All changed packages" option first in package list

- Updated dependencies [355b4d00]:
  - get-workspaces@0.2.0

## 1.1.1

### Patch Changes

- [b93d04a2](https://github.com/Noviny/changesets/commit/b93d04a2) - Consume get-workspaces as dependency
- [079eabae](https://github.com/Noviny/changesets/commit/079eabae) [#33](https://github.com/Noviny/changesets/pull/33) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Fix a bug with linked packages where it would break if there was a linked package that didn't have a changeset

- Updated dependencies [b93d04a2]:
  - get-workspaces@0.1.0

## 1.1.0

### Minor Changes

- [6929624b](https://github.com/Noviny/changesets/commit/6929624b) [#27](https://github.com/Noviny/changesets/pull/27) Thanks [@mitchellhamilton](https://github.com/mitchellhamilton)! - Add linked packages/lockstep

## 1.0.1

### Patch Changes

- 9435d886: Fix binary and published files

## 1.0.0

### Major Changes

- 51c8b0d6: Remove `noChangelog` flag in favor of `updateChangelog` flag (default behaviour remains the same).

  If you were using this custom flag, you will need to replaces `noChangelog: true` with `updateChangelog: false`

- 51c8b0d6: Rename commands from @atlaskit/build-releases

  We are no longer mirroring the names from npm/yarn commands, so it is easy to write package scripts
  for each command without footguns. The functionality of the commands remains the same. In addition,
  the binary has been changed to `changeset`.

  The new names are:

  - `build-releases initialize` => `changeset init` (for ecosystem consistency)
  - `build-releases changeset` => `changeset` (default command). You can also run `changeset add`
  - `build-releases version` => `changeset bump`
  - `build-releases publish` => `changeset release`

  The function of these commands remains unchanged.

  - 51c8b0d6: Change format of changelog entries

  Previously changelog entries were in the form of:

  ```md
  ## 2.1.0

  - [patch] Allows passing --public flag for publishing scoped packages [159c28e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/159c28e)
  - [minor] Changes changelogs to be opt out rather than opt in [f461788](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f461788)
  ```

  which doesn't take into account the importance of particular entries. We are moving to an ordered system for changelog
  entries, and to match this, we are updating the headings we use to the following format:

  ```md
  ## 2.1.0

  ### Minor

  - Allows passing --public flag for publishing scoped packages [159c28e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/159c28e)

  ### Patch

  - [minor] Changes changelogs to be opt out rather than opt in [f461788](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f461788)
  ```

  This changes the format of the default `getReleaseLine` from

  ```js
  const getReleaseLine = async (changeset, versionType) => {
    const indentedSummary = changeset.summary
      .split("\n")
      .map(l => `  ${l}`.trimRight())
      .join("\n");

    return `- [${versionType}] ${changeset.commit}:\n\n${indentedSummary}`;
  };
  ```

  to

  ```js
  const getReleaseLine = async (changeset, type) => {
    const [firstLine, ...futureLines] = changeset.summary
      .split("\n")
      .map(l => l.trimRight());

    return `- ${changeset.commit}: ${firstLine}\n${futureLines
      .map(l => `  ${l}`)
      .join("\n")}`;
  };
  ```

  You will end up with some odd changelog entries if you do not update your release line.

### Minor Changes

- 51c8b0d6: Support non-bolt repositories

  Changesets have been expanded to support:

  - bolt repositories
  - yarn workspaces-based repositories
  - single package repositories.

  Currently **not** supported: bolt repositories with nested workspaces.

  To do this, functions that call out to bolt have been inlined, and obviously marked
  within the file-system. In addition, the `get-workspaces` function has undergone
  significant change, and will be extracted out into its own package soon.

  This is to support other tools wanting this level of inter-operability.

  If plans to modularize bolt proceed, we may go back to relying on its functions.

  This should have no impact on use.

  - 51c8b0d6: Add 'select all' and 'select all changed' options, to make mass-bumping easier.
  - eeb4d5c6: Add new command: `status` - see Readme for more information

# @atlaskit/build-releases - legacy changelog

## 3.0.3

- [patch][c87337f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c87337f):

  - The version command now removes empty folders before it starts. This should prevent a race condition in CI

## 3.0.2

- [patch][f7b030a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f7b030a):

  - Fixes potential infinite loop in parseChangesetCommit

## 3.0.1

- [patch][494c1fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/494c1fe):

  - Update git commit message to match previous tooling.

## 3.0.0

- [major][44ec8bf" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44ec8bf"
  d):

  Changesets now use local file system - this has several effects:

  1. Changesets will no longer automatically create a commit. You will need to add and commit the files yourself.
  2. Changesets are easier to modify. You should ONLY modify the changes.md file (_Not changes.json_).
  3. There will be a new directory which is `.changeset`, which will hold all the changesets.

  Apart from these changes, your process using this should not have changed.

  Changeset now accepts skipCI flag, where previously release commits automatically skipped CI. i.e.

  ```
  yarn build-releases version --skipCI
  ```

  **Breaking**: Changeset and version commands now accept `--commit` flag which makes them commit automatically (previously this was the default behaviour). Otherwise, these commands simply make the file-system changes.

  ```
  yarn build-releases changeset --commit
  ```

  We also introduce the `intitialize` command. See the package [README.md](https://www.npmjs.com/package/@atlaskit/build-releases) for more details about this.

## 2.1.3

- [patch] Bumps bolt version to get some bug fixes around publishing [493f5f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/493f5f7)

## 2.1.2

- [patch] Pulls in fix in bolt causing publishing to fail when running a yarn subprocess (see boltpkg/bolt #189) [2b36121](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b36121)

## 2.1.1

- [patch] Fixes bug where empty summaries would cause a changeset to not get found [25b30bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25b30bf)

## 2.1.0

- [minor] Allows passing --public flag for publishing scoped packages [159c28e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/159c28e)
- [minor] Changes changelogs to be opt out rather than opt in [f461788](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f461788)

## 2.0.0

- [major] Completely refactors build-releases to be externally consumable 8458ef7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8458ef7)

## 1.28.2

- [patch] Bug fix and better error messages for changeset error [7f09b86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f09b86)

## 1.28.1

- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)

## 1.28.0

- [minor] Adds tagging to releases [34c64fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34c64fd)

## 1.27.0

- [minor] Splits out and exposes flattenChangesets function [5ee5f74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ee5f74)

## 1.26.0

- [minor] Lots of new features (consider this package unstable and only for use internally) [7cdf2e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cdf2e6)
