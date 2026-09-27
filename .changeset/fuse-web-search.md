---
'@verdaccio/search-indexer': minor
'@verdaccio/store': minor
'@verdaccio/web': minor
---

Use the Fuse.js search behavior from the 8.x line for local packages in the web search.

The web search now matches package names, keywords, descriptions and publishers with
case-insensitive, approximate matching, including misspelled names and internal name
fragments. Local matches are ranked with the same field weights and threshold as the
8.x indexer, then combined with cached and uplink results using the existing response
format. Access checks still run before the web's twenty-result limit.

Each registry instance owns its search index. Initialization waits for existing local
packages to be indexed, and changes to package metadata, latest tags and removals
update the index. The npm search endpoints retain their existing search behavior.
