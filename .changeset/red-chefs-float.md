---
'@verdaccio/store': patch
'@verdaccio/web': patch
---

Fix the search by exact name of the package

Full package name queries was not finding anithing. It was happening
becouse of stemmer of [lunr.js](https://lunrjs.com/).

To fix this, the stemmer of [lunr.js](https://lunrjs.com/) was removed from search pipeline.
