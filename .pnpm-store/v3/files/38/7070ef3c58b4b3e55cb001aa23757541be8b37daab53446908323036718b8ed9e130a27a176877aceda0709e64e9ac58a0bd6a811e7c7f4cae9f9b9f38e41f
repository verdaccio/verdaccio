# Lunr Mutable Indexes - Mutable indexes for lunr.js 2.1.x

With the release of [lunr.js 2.0](https://github.com/olivernn/lunr.js), lunr
removed the ability to update existing indexes with new data.  While the space
benefits of this change are nice, some users need the flexibility of updating
their indexes with new data.  That's what this library is for.

# Example

A simple search index can be created with the familiar `lunr` syntax; just substitute `lunr-mutable` for `lunr`.

```js

var lunrMutable = require('lunr-mutable-indexes');

var index = lunrMutable(function () {
  this.field('title')
  this.field('body')

  this.add({
    "title": "Twelfth-Night",
    "body": "If music be the food of love, play on: Give me excess of it…",
    "author": "William Shakespeare",
    "id": "1"
  })
})
```

Now, with a mutable index, we can add...

```js
index.add({
    "title": "Merchant of Venice",
    "body": "You speak an infinite deal of nothing.",
    "author": "William Shakespeare",
    "id": "2"
});
```

Remove...

```js
index.remove({ id: "1" });
```

Or update existing documents.

```js
index.update({
    "body": "With mirth and laughter let old wrinkles come.",
    "id": "2"
});
```

Index serialization also works, with the Index namespace accessible through the `lunr-mutable-indexes` object.

```js
// Serialize an index:
var serialized = JSON.stringify(index);

// ...and deserialize it later:
var sameIndex = lunrMutable.Index.load(JSON.parse(serialized));
```

# Caveats

The main tradeoffs with `lunr-mutable-index` were originally discussed in [this PR](https://github.com/olivernn/lunr.js/pull/315) in `lunr`.
* Mutable indexes work by having a handle to their original builder - this inflates the index size a bit.
* Changing a builder's tokenizer won't persist across serialization boundaries.
* Gaps in builder.termIndex may build up when documents are deleted.
* The index is completely rebuilt when a document is added/updated/removed

Work is ongoing to make improvements with these potential drawbacks, but please feel free to contribute fixes!

# Thanks

I wrote a simple extension to lunr.js - I would like to thank the following people for helping to make my life easier:

  * Oliver Nightingale (@olivernn) for writing lunr.js in the first place!
  * John Kupko (@k00p) for making the library easier to use and helping with some of the NPM plumbing!
