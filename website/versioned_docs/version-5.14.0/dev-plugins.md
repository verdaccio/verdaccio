---
id: dev-plugins
title: "Developing Plugins"
---

There are many ways to extend `verdaccio`, the kind of plugins supported are:

* [Authentication](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Storage](plugin-storage.md)
* Theme
* Filter plugins

> We recommend developing plugins using our [Typescript type definitions](https://github.com/verdaccio/monorepo/tree/master/core/types).

# Other plugins

The following plugins are valid and in process of incubation.


## Theme Plugin {#theme-plugin}

The plugin must return a function that returns a **string**. The string should be the absolute location of the root of your user interface.

### API {#api}

```javascript
const path = require('path');

module.exports = (...arguments) => {
  return path.join(__dirname, 'static');
};
```

It is imporant that the name of the plugin **must start with `verdaccio-theme-` prefix**.

### Theme Example {#theme-example}

* [@verdaccio/ui-theme](https://github.com/verdaccio/ui): The default Verdaccio theme based in React.js.

## Filter Plugin {#filter-plugin}

Since [`4.1.0`](https://github.com/verdaccio/verdaccio/pull/1313)


Filter plugins were introduced due a [request](https://github.com/verdaccio/verdaccio/issues/818) in order
to be able to filter metadata from uplinks.

More [info in the PR](https://github.com/verdaccio/verdaccio/pull/1161).



```yaml
filters:
   storage-filter-blackwhitelist:
     filter_file: /path/to/file
```


### API {#api-1}

The method `filter_metadata` will allow you to filter metadata that comes from any uplink, it is `Promise` based
and has to return the same metadata modified.

> Do not remove properties from the metadata, try to do not mutate rather return a new object.

```
interface IPluginStorageFilter<T> extends IPlugin<T> {
	filter_metadata(packageInfo: Package): Promise<Package>;
}
```
