---
'verdaccio': patch
---

Make `/-/v1/search` work for storage plugins that still use the callback API.

Verdaccio 7 keeps callback-based storage plugins running through a compatibility
adapter. Its `search` collected whatever the plugin streamed and handed the list
straight back, with two consequences for every such plugin.

The search query was dropped before it reached the plugin, and the adapter passed a
name predicate that always returned true, so the plugin emitted its whole catalogue and
nothing ever filtered it. `/-/v1/search` answered with every package in the registry
regardless of the text searched for, and paginated over that full list. It failed
silently: the endpoint returned 200 and the npm client still found what it asked for,
buried among everything else.

The adapter also passed the items through unchanged. The legacy contract emits the
package itself, while the store reads `item.package.name`, so a plugin following the
documented contract made the endpoint fail with a 500 instead.

The adapter now filters the collected results by the query text and wraps anything that
is not already in the store's shape. The filtering is done on the emitted name, never on
the name predicate a plugin is given: that one receives the basename, so rejecting there
would drop scoped packages whose full name does match. Operators running a callback-based
storage plugin get working search without touching the plugin; plugins already on the
promise-based API were never wrapped and are unaffected.
