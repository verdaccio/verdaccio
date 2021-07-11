---
id: dev-plugins
title: "Sviluppare Estensioni"
---

Esistono diversi modi di ampliare `verdaccio`, i tipi di estensioni supportati sono:

* [Autenticazione](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Archiviazione](plugin-storage.md)
* Tema
* Filter plugins

> We recommend developing plugins using our [Typescript type definitions](https://github.com/verdaccio/monorepo/tree/master/core/types).

# Altri plugin

The following plugins are valid and in process of incubation.

## Theme Plugin

Il plugin deve restituire una funzione che restituisca una **stringa**. La stringa dovrebbe essere l'ubicazione completa della root dell'interfaccia utente.

### API

```javascript
const path = require('path');

module.exports = (...arguments) => {
  return path.join(__dirname, 'static');
};
```

È importante che il nome del plugin **deve iniziare con il prefisso `verdaccio-theme-`**.

### Esempio di Tema

* [@verdaccio/ui-theme](https://github.com/verdaccio/ui): Il tema di default di Verdaccio costruito su React.js.

## Filter Plugin

Since [`4.1.0`](https://github.com/verdaccio/verdaccio/pull/1313)

Filter plugins were introduced due a [request](https://github.com/verdaccio/verdaccio/issues/818) in order to be able to filter metadata from uplinks.

More [info in the PR](https://github.com/verdaccio/verdaccio/pull/1161).

```yaml
filters:
   storage-filter-blackwhitelist:
     filter_file: /path/to/file
```

### API

The method `filter_metadata` will allow you to filter metadata that comes from any uplink, it is `Promise` based and has to return the same metadata modified.

> Do not remove properties from the metadata, try to do not mutate rather return a new object.

    interface IPluginStorageFilter<T> extends IPlugin<T> {
        filter_metadata(packageInfo: Package): Promise<Package>;
    }