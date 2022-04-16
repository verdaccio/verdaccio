---
'@verdaccio/config': minor
'@verdaccio/types': minor
'@verdaccio/ui-theme': minor
---

feat: rework web header for mobile, add new settings and raw manifest button

### New set of variables to hide features

Add set of new variables that allow hide different parts of the UI, buttons, footer or download tarballs. _All are
enabled by default_.

```yaml
# login: true <-- already exist but worth the reminder
# showInfo: true
# showSettings: true
# In combination with darkMode you can force specific theme
# showThemeSwitch: true
# showFooter: true
# showSearch: true
# showDownloadTarball: true
```

> If you disable `showThemeSwitch` and force `darkMode: true` the local storage settings would be
> ignored and force all themes to the one in the configuration file.

Future could be extended to

### Raw button to display manifest package

A new experimental feature (enabled by default), button named RAW to be able navigate on the package manifest directly on the ui, kudos to [react-json-view](https://www.npmjs.com/package/react-json-view) that allows an easy integration, not configurable yet until get more feedback.

```yaml
showRaw: true
```

#### Rework header buttons

- The header has been rework, the mobile was not looking broken.
- Removed info button in the header and moved to a dialog
- Info dialog now contains more information about the project, license and the aid content for Ukrania now is inside of the info modal.
- Separate settings and info to avoid collapse too much info (for mobile still need some work)
