---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Clean up console noise with real fixes behind it: the security login page nested a `<form>` inside another `<form>` (invalid HTML — the outer element is now a plain container), an aborted search request (user kept typing or navigated away) was logged as an error, and the i18next vendor support notice no longer prints to every browser console. Test-side, raw DOM clicks were replaced with `fireEvent` and the login test router now defines the success route, leaving the ui-components and ui-theme suites with zero warnings.
