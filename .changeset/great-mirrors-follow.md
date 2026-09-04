---
'@verdaccio/web': patch
---

fix(web): sign up now issues the web session JWT (the npm API token stored before could not be parsed by the UI, so the new user was never logged in), and the sidebar/readme endpoints resolve dist-tags in the `v` query param again — deep links like `/detail/pkg/v/beta` were returning 404 after the own-property hardening. Unknown versions and tags still 404, and `__proto__`-style values still never resolve.
