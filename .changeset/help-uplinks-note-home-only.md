---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Show the note about uplink packages only on the home page help card, not in the settings dialog.

The note explaining that packages fetched from uplinks such as npmjs are cached but not listed, with its "How uplinks work" link, is about the empty package list on the home page. It was also shown under the publishing guide in the settings dialog, where there is no list to explain. It now appears only on the home page help card.
