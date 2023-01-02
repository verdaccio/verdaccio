---
'@verdaccio/types': major
'@verdaccio/ui-theme': major
'@verdaccio/ui-components': major
---

feat(web): components for custom user interfaces

Provides a package that includes all components from the user interface, instead being embedded at the `@verdaccio/ui-theme` package.

```
npm i -D @verdaccio/ui-components
```

The package contains

- Components
- Providers
- Redux Storage
- Layouts (precomposed layouts ready to use)
- Custom Material Theme

The `@verdaccio/ui-theme` will consume this package and will use only those are need it.

> Prerequisites are using Redux, Material-UI and Translations with `i18next`.

Users could have their own Material UI theme and build custom layouts, adding new features without the need to modify the default project.
