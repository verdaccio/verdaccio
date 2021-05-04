---
'@verdaccio/types': minor
'@verdaccio/ui-theme': minor
'@verdaccio/web': minor
---

web: allow ui hide package managers on sidebar

If there is a package manager of preference over others, you can define the package managers to be displayed on the detail page and sidebar, just define in the `config.yaml` and web section the list of package managers to be displayed.

```
web:
  title: Verdaccio
  sort_packages: asc
  primary_color: #cccccc
  pkgManagers:
    - pnpm
    - yarn
    # - npm
```

To disable all package managers, just define empty:

```
web:
  title: Verdaccio
  sort_packages: asc
  primary_color: #cccccc
  pkgManagers:
```

and the section would be hidden.
