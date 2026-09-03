---
'@verdaccio/ui-components': patch
---

A 5xx or network failure while loading a package left the detail page blank, and clicking the Versions or Dependencies tab crashed the whole UI through the root error boundary. The detail page now renders a proper error state for generic failures (the provider previously ignored errors without an HTTP code), and the tab components guard against a missing manifest.
