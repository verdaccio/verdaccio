---
'@verdaccio/package-filter': patch
---

Keep the `latest` dist-tag on the same major line when `@verdaccio/package-filter` removes the version it pointed to.

When a filtered or deprecated version was the target of `latest`, the plugin used to reassign `latest` to the most recently published remaining stable version, even if that version belonged to a different major line. For a package with several release tracks (for example `5.2.1` filtered out while `4.22.2` was published later), `latest` could jump from `5.x` to `4.x`.

The replacement is now chosen only among versions of the same major as the original `latest`, preferring the newest stable one. If no version of that major line remains, `latest` is removed instead of pointing at another release track. Custom dist-tags such as `latest-4`, `next` or `beta` are still not recomputed.
