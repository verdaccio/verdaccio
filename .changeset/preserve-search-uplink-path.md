---
'@verdaccio/proxy': patch
---

Preserve configured uplink subpaths and authentication headers when forwarding search requests.
Searches to uplinks such as `https://host.example/private/npm` retain `/private/npm` and use the
uplink's authentication and configured headers. Sensitive client headers are not forwarded.

Normalize the pathname without modifying the configured URL, including when the uplink URL
contains a query string or fragment. The search request retains its own query parameters and
does not lose the last segment of the uplink subpath.
