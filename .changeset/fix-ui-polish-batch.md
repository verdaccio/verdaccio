---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
'@verdaccio/ui-i18n': patch
---

Sub-path deployment and polish fixes: the security pages' internal links used raw hrefs that skipped the router basename (404 behind a reverse proxy with `url_prefix`), and the success page's close button landed on the proxy root, outside the registry; dayjs now follows the selected UI language (dates and "published X ago" were always in English — the locale loader was never invoked and ran before the persisted language applied); an expired session now clears the stored token on boot and the header notices expiry within a minute instead of up to an hour; "Invalid Date" tooltips are gone when a version has no timestamp; `keywords: []` no longer paints an empty Keywords section (and the keyword list no longer mutates the prop); a non-string `homepage` no longer crashes the detail page; the copy button always has an accessible name and the icon-only support tab an aria-label; and the `x-client` header is sent on anonymous requests too.
