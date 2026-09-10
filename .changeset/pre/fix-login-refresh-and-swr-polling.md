---
'@verdaccio/ui-components': patch
---

fix: save auth token synchronously before navigation on login to ensure package list refreshes with authenticated access

Disable SWR revalidateOnFocus and revalidateOnReconnect to prevent unnecessary repeated API calls

Closes #5813
