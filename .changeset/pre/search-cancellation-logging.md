---
'@verdaccio/proxy': patch
---

Avoid reporting cancelled web searches as uplink failures in error logs.

In the 9.x proxy modules and the Verdaccio 7 releases that consume them, closing a
web search connection could log an uplink error even though the registry had
cancelled the request itself. Non-paginated searches now follow the same logging
policy as paginated searches: cancellation still rejects the request, while DNS,
connection, timeout, and invalid-response failures continue to be logged when the
request has not been cancelled. No configuration changes are required.
