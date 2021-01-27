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

### Web new properties for dynamic template

The new set of properties are made in order allow inject _html_ and _JavaScript_ scripts within the template. This
might be useful for scenarios like Google Analytics scripts or custom html in any part of the body.

- metaScripts: html injected before close the `head` element.
- scriptsBodyAfter: html injected before close the `body` element.
- bodyBefore: html injected before verdaccio JS scripts.
- bodyAfter: html injected after verdaccio JS scripts.

```yaml
web:
  scriptsBodyAfter:
    - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
  metaScripts:
    - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
    - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
    - '<meta name="robots" content="noindex" />'
  bodyBefore:
    - '<div id="myId">html before webpack scripts</div>'
  bodyAfter:
    - '<div id="myId">html after webpack scripts</div>'
```
