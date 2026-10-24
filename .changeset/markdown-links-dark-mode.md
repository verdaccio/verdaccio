---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Make links inside the web UI's markdown text readable in dark mode.

Text rendered from markdown, such as the package filter link under the minimum release age settings, the package manager notes and the translation contribution text in the settings dialog, used plain browser links whose default dark blue was nearly invisible on the dark theme. These links now use the theme's link style, the same as the documentation link in the dialog footer, in both light and dark mode. The custom footer, powered-by text and `web.help` markdown get the same styling, and every markdown link opens in a new tab.
