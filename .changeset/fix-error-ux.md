---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
'@verdaccio/ui-i18n': patch
---

Error feedback overhaul for the web UI: login failures now distinguish wrong credentials (401) from a dead server, 500 or rate limit instead of always claiming "Invalid username or password", and the server's own error message is surfaced on the security pages; form validation messages are localized (the yup schema messages rendered raw i18n keys or English defaults); submit buttons are disabled while the request is in flight (a double click meant a double POST); a failed search shows an error instead of "no results found" and the dropdown no longer lists the previous query's results under the new input; failed or empty tarball downloads (including staged tarballs) show an error instead of doing nothing; a 2xx login response without a token no longer passes as a successful login; and the home-card download button no longer pushes a stray `#` into the browser history.
