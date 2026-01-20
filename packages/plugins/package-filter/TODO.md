- ✅ Check whether `setupLatestTag()` needs to find latest version in non-next versions.
  UPD: yes, current logic is not entirely right.
  Tag 'latest' must be set to a version that has no other tags associated with it.
- ✅ Fix `setupLatestTag()` logic:
  - ✅ Modify `dist-tags/latest` only if it was removed by `cleanupTags()` earlier.
  - ✅ Make it set `dist-tags/latest` to a version that has no tags associated with it.
  - ✅ Add unit tests.
- 🔴 Fix `setupLatestTag()` logic again:
  - ✅ Investigate why it may assign not the most recent release to be a latest.
  - ✅ Make it pick version which is not suffixed with "-next" or "-beta" or whatever in the first pass.
    If it fails, fall back to standard algorithm.
  - 🔴 Add/modify unit tests.
- ✅ Investigate whether `_attachments` and `_distfiles` needs to be cleaned.
  See whether there are other parts of `package.json` are in need of cleaning.
  UPD: yes, `_distfiles` needs to be cleaned. And no, it appears that no other part needs to be cleaned.
  - ✅ Clean `_distfiles`.
  - ✅ Test `_distfiles` are cleaned.
  - ✅ Test filter supports manifests with no `_distfiles`.
- ✅ Add `minAgeDays` configuration option.
  - ✅ Implement filtering based on age.
  - ✅ Add unit test for this option.
  - ✅ Describe in README.md why this option is helpful in the light of the latest supply chain attack (Shai Hulud).
- ✅ Rewrite all tests to test `VerdaccioMiddlewarePlugin` instead of `filterBlockedVersions()`.
  - ✅ Remove export for filterBlockedVersions().
- ✅ Fix `dist-tags/latest` still contains version that was filtered out.
- ✅ Make `dist-tags/latest` set to latest version after filtering.
- ✅ Fix `time` property still contains entries for versions that were cut.
- ✅ Fix side effects of not cloning package under some conditions.
- ✅ Fix `minAgeDays` sets `dateThreshold` internally.
  Server can be run for days/months and `dateThreshold` will stay fixed
  while user expects age to be calculated based on the current date.
  - ✅ Compare version age with minAgeDays in each `filter_metadata()` call.
  - ✅ Add unit test checking that earliest effective date threshold is applied.
- ✅ Fix `created` and `modified` are removed from `time`.
  - ✅ Recalculate `created` and `modified` and write to `time`.
  - ✅ Update tests accordingly. Add `created` and `modified` to initial data.
- ✅ Fix `filterBlockedVersions()` should not update readme when no actual changes to package were made.
- ✅ Test that block by version does not modify readme when nothing was changed.
- ✅ Test that replace by version does not modify readme when nothing was changed.
- ✅ Fix replace by version strategy is not specified in type of config input.
- ✅ Test that replace by version setting works.
- ✅ Test that `dateThreshold` setting works.
- ✅ Update README.md:
  - ✅ Split config into several task-based sections.
  - ✅ Describe main intent of this package - filtering versions by age to prevent 0-day attacks.
  - ✅ Describe configuration of `minAgeDays` parameter.
  - ✅ Describe installation more thoroughly. It's not enough to just run `npm i -g verdaccio-plugin-delay-filter`. UPD: it seems to be enough now in Verdaccio 6.2.0.
  - ✅ Mention where to configure "filters:" (config.yaml verdaccio).
  - ✅ Remove deprecation from `dateThreshold` parameter. It's not that useless actually.
- ✅ Do not compile index.test.ts into lib/index.test.js. It should not end up in distrubution files.
- ✅ Implement whitelisting packages by scope, package and/or versions.
- ✅ Fix vulnerabilities revealed by npm audit: 39 vulnerabilities (7 low, 18 moderate, 14 high).
  UPD: this task is not applicable after moving plugin to verdaccio monorepo.
- 🔴 Move plugin to verdaccio monorepo.
  - ✅ Change `CustomConfig` to some meaningful name.
  - ✅ It seems that `CustomConfig` doesn't need to extend `Config`.
  - ✅ Setup logger the same way other plugins do - via setup({}) from @verdaccio/logger.
  - ✅ Use `Manifest` instead of deprecated `Package`.
  - 🔴 Cleanup package.json dependencies, devDependencies and tsconfig.json references.
    These files were copied from Verdaccio Memory Storage Plugin.
  - 🔴 Bring unit tests back to life.
    - ✅ Integrate tests from original project.
    - ✅ Migrate test code from jest to vitest.
    - 🔴 Extract babelTestPackage, typesNodePackage and other test data to separate file.
    - ✅ See if relying on shapshots is the best approach here. It often makes intent unclear.
      UPD: yes, using snapshots to ensure transformed package.json conforms to what we expect
      is the most approriate way here.
    - 🔴 See whether we need to add e2e tests for this plugin.
  - 🔴 Fix lint issues if any.
  - 🔴 Search for verdaccio coding/style guidelines (aside from lint rules).
    - 🔴 Align code with guidelines.
  - 🔴 Add readme that conforms to other built-in plugins.
  - 🔴 Add changelog.
- 🔴 Remove this TODO.md file before PR.
