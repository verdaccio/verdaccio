---
'@verdaccio/ui-components': patch
---

Valid npm manifest fields in string form were ignored by the UI: `repository: "git://..."` hid the repository section (and `git+ssh`/`git` urls rendered as dead links — they are now rewritten to https), `funding` in string or array form hid the fund button, and `bugs` as a string lost the open-an-issue button on the detail page and home cards. Contributors or maintainers without an email no longer collapse into a single person.
