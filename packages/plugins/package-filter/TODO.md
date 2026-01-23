- ✅ Check whether `setupLatestTag()` needs to find latest version in non-next versions.
  UPD: yes, current logic is not entirely right.
  Tag 'latest' must be set to a version that has no other tags associated with it.
- ✅ Fix `setupLatestTag()` logic:
  - ✅ Modify `dist-tags/latest` only if it was removed by `cleanupTags()` earlier.
  - ✅ Make it set `dist-tags/latest` to a version that has no tags associated with it.
  - ✅ Add unit tests.
- ✅ Fix `setupLatestTag()` logic again:
  - ✅ Investigate why it may assign not the most recent release to be a latest.
  - ✅ Make it pick version which is not suffixed with "-next" or "-beta" or whatever in the first pass.
    If it fails, fall back to standard algorithm.
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
- ✅ Move plugin to verdaccio monorepo.
  - ✅ Change `CustomConfig` to some meaningful name.
  - ✅ It seems that `CustomConfig` doesn't need to extend `Config`.
  - ✅ Setup logger the same way other plugins do - via setup({}) from @verdaccio/logger.
  - ✅ Use `Manifest` instead of deprecated `Package`.
  - ✅ Manage package.json dependencies, devDependencies and tsconfig.json references.
    These files were copied from Verdaccio Memory Storage Plugin.
    They probably need some additional attention for this package.
  - ✅ Split index.ts code to several files.
  - ✅ Add named export to accompany default export in index.ts.
  - ✅ Bring unit tests back to life.
    - ✅ Integrate tests from original project.
    - ✅ Migrate test code from jest to vitest.
    - ✅ Extract babelTestPackage, typesNodePackage and other test data to separate file.
    - ✅ See if relying on shapshots is the best approach here. It often makes intent unclear.
      UPD: yes, using snapshots to ensure transformed package.json conforms to what we expect
      is the most approriate way here.
    - ✅ See whether we need to add e2e tests for this plugin.
      UPD: no other plugin have them.
  - ✅ See what can be borrowed from pyhp2017's solution regarding to methods of storage.ts,
    e.g. his changes for getTarball(), getLocalDatabase(), etc.
    https://github.com/verdaccio/verdaccio/pull/5505/commits/707bb35e5f878df094a8385288231237ab030c4a
    UPD: changing these methods requires testing and it can only be solved with e2e tests
    where verdaccio loads with filter plugin onboard.
    UPD: actually I might wrong on e2e requirement.
    It seems only the storage.spec.ts needs to be modified to cover new functionality of changed methods.
  - ✅ Fix lint issues if any.
  - ✅ Search for verdaccio coding/style guidelines (aside from lint rules).
    UPD: no guidelines, only lint/prettier.
  - ✅ Fix what went wrong with config parsing.
    Debug log shows that `allowRules` is empty even though `allow` is set.
    I presume this is because Map converter is not supplied to JSON.stringify().
    - ✅ Print full data of parsed config into debug log.
    - ✅ Fix parseConfig(): make it return parsed config consisting only of what it actually understood.
      There is no need to merge input config into result.
    - ✅ Fix 'storage has failed' error doesn't provide details in log when config is malformed.
      UPD: error details are actually provided, but instead of printing it after the 'storage has failed',
      verdaccio prints it as uncaught exception.
      It seems that at some point in time there was a change in verdaccio,
      as in server.ts it tries to print value of err.msg property, whereas it clearly should address err.message.
      Probably it was err.msg everywhere earlier and now code is mixed.
      I don't know, it's out of the scope for this task.
  - ✅ Add readme that conforms to other built-in plugins.
  - ✅ Add changelog.
  - ✅ See what can be done with this request (npm search filtering):
    (https://github.com/verdaccio/verdaccio/pull/5505#issuecomment-3708200082)
    UPD: unfortunately, not much can be done.
    There are two stages of the search - local (cached) and uplinks.
    Filtering of cached packages was added.
    Uplinks search cannot be filtered without fetching manifests for each of the search results.
    And fetching them is a heavy burden.
  - ✅ Bump plugin version to make it appear unambiguously newer
    than the original verdaccio-plugin-delay-filter package.
    Original package readme will be updated to direct users
    towards the new package hosted in verdaccio scope.
