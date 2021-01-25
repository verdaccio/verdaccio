---
'@verdaccio/ui-theme': major
'@verdaccio/cli-standalone': major
'@verdaccio/web': major
---

feat: flexible user interface generator

**breaking change**

The UI does not provide a pre-generated `index.html`, instead the server generates
the body of the web application based in few parameters:

- Webpack manifest
- User configuration details

It allows inject html tags, javascript and new CSS to make the page even more flexible.
