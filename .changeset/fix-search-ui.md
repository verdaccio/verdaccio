---
'@verdaccio/ui-components': patch
---

fix: search component improvements

- fix: extract search query from URL path instead of query params to match API routing
- fix: decode URI components in search query (e.g. `%40` to `@`) for scoped packages
- fix: resolve undefined package name on search result click when `searchRemote` is disabled
- feat: display "No results found" message when search yields no matches
- feat: make detail page tabs full-width on desktop and scrollable on mobile
- test: add unit tests for AutoComplete component
- test: update Search tests to cover debounce memoization and cleanup on unmount
