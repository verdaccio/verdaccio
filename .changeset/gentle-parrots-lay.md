---
'@verdaccio/config': minor
'@verdaccio/local-storage': minor
'@verdaccio/e2e-ui': minor
---

Some verdaccio modules depend on 'mkdirp' library which provides recursive directory creation functionality.
NodeJS can do this out of the box since v.10.12. The last commit in 'mkdirp' was made in early 2016, and it's mid 2021 now.
Time to stick with a built-in library solution!

- All 'mkdirp' calls are replaced with appropriate 'fs' calls.
