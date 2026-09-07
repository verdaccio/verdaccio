---
'@verdaccio/api': patch
'@verdaccio/proxy': patch
'@verdaccio/search': patch
'@verdaccio/store': patch
---

Fix Search v1 pagination by collecting bounded uplink pages from offset zero and applying the client offset once, after deduplication and access checks. Keep result ordering stable across uplink rounds, fetch additional candidates when needed, and cancel work on disconnect or after 30 seconds. Return 503 when an uplink fails, stops advancing, or the shared budget of 100 requests / 25,000 candidates is exhausted instead of returning an incomplete successful page.
