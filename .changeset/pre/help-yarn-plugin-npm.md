---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Suggest Verdaccio's yarn-plugin-npm in the web UI help guide when the yarn tab is selected.

The "Create a user or log in" step only offered `npm adduser`, so Yarn users had to switch to npm to get a token. With the yarn tab selected, the step now also shows how to install the plugin (`yarn dlx @verdaccio/yarn-import npm-login`) and log in with `yarn npm login --registry <url>`, which can create the user on the registry and stores the token in `~/.yarnrc.yml`, plus a link to https://github.com/verdaccio/yarn-plugin-npm. Other tabs are unchanged.
