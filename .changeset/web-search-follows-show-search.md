---
'verdaccio': minor
---

`web.showSearch: false` now also disables the web search endpoint.

Until now the option only hid the search box in the header, while `/-/verdaccio/data/search` kept answering. With `showSearch: false` the endpoint is no longer registered and answers 404, the same way `web.login: false` removes the web login endpoints. The npm search API used by `npm search` (`/-/v1/search`) is not affected, and nothing changes for registries that leave `showSearch` unset or set it to `true`.
