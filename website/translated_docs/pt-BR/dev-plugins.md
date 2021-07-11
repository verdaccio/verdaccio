---
id: dev-plugins
title: "Criando Plugins"
---

Existem muitas maneiras de estender o `verdaccio`, os tipos de plugins suportados são:

* [Autenticação](plugin-auth.md)
* [Midleware](plugin-middleware.md)
* [Armazenamento](plugin-storage.md)
* Theme
* Filter plugins

> We recommend developing plugins using our [Typescript type definitions](https://github.com/verdaccio/monorepo/tree/master/core/types).

# Other plugins

The following plugins are valid and in process of incubation.

## Plugin de Tema

The plugin must return a function that returns a **string**. The string should be the absolute location of the root of your user interface.

### API

```javascript
const path = require('path');

module.exports = (...arguments) => {
  return path.join(__dirname, 'static');
};
```

É importante que o nome do plugin **deve começar com o prefixo `verdaccio-theme-`**.

### Exemplo de Tema

* [@verdaccio/ui-theme](https://github.com/verdaccio/ui): O tema padrão do Verdaccio é baseado no React.js.

## Plugin de Filtro

A partir da [`v4.1.0`](https://github.com/verdaccio/verdaccio/pull/1313)

Os plugins de filtro foram introduzidos sob [solicitação](https://github.com/verdaccio/verdaccio/issues/818) para possibilitar a filtragem de metadados de uplinks.

Mais [informações na PR](https://github.com/verdaccio/verdaccio/pull/1161).

```yaml
filters:
   storage-filter-blackwhitelist:
     filter_file: /path/to/file
```

### API

O método `filter_metadata` permitirá que você filtre metadados provenientes de qualquer uplink, ele é baseado em `Promise` e tem que retornar os mesmos metadados modificados.

> Do not remove properties from the metadata, try to do not mutate rather return a new object.

    interface IPluginStorageFilter<T> extends IPlugin<T> {
        filter_metadata(packageInfo: Package): Promise<Package>;
    }