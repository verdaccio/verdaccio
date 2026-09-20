---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

fix(ui): follow-ups to the web UI bug batch

- login and signup now update the auth context, so the header reflects the session immediately instead of showing the login button until a manual refresh
- a 2xx login/signup response without a token shows an error instead of a false success page
- a readme-only failure no longer blanks the whole package detail page, and a failed revalidation no longer hides the cached package list on the home page
- the versions filter resets when navigating to another package instead of silently applying the previous package's filter
- the search dropdown shows the loading state during the debounce window instead of flashing "No results found" on every keystroke
- the session now logs out exactly when the token expires (single timer) instead of polling every minute and hard-reloading mid-interaction
- a malformed leading `funding` entry no longer hides a later valid funding url
