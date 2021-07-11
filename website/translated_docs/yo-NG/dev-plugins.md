---
id: dev-plugins
title: "Ṣiṣe agbedide Awọn ohun elo"
---

Awọn ọna pupọ lo wa lati fa `verdaccio` gun si, iru awọn ohun elo ti atilẹyin wa fun ni:

* [Ifasẹsi](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Ibi ipamọ](plugin-storage.md)
* Theme
* Filter plugins

> We recommend developing plugins using our [Typescript type definitions](https://github.com/verdaccio/monorepo/tree/master/core/types).

# Other plugins

The following plugins are valid and in process of incubation.

## Ohun elo Akori

The plugin must return a function that returns a **string**. The string should be the absolute location of the root of your user interface.

### API

```javascript
const path = require('path');

module.exports = (...arguments) => {
  return path.join(__dirname, 'static');
};
```

O jẹ pataki pe orukọ ohun elo naa **gbọdọ bẹrẹ pẹlu afikun iṣaaju `verdaccio-theme-`**.

### Apẹẹrẹ Akori

* [@verdaccio/ui-theme](https://github.com/verdaccio/ui): Akori atilẹwa Verdaccio to da lori React.js.

## Ohun elo Asẹ

Lati [`4.1.0`](https://github.com/verdaccio/verdaccio/pull/1313)

Awọn ohun elo asẹ jẹ ṣiṣe nitori [ibeere fun](https://github.com/verdaccio/verdaccio/issues/818) lati le ni anfani lati ya metadata sọtọ kuro ni ara awọn uplink.

Alaye siwaju si [wa ninu PR](https://github.com/verdaccio/verdaccio/pull/1161).

```yaml
filters:
   storage-filter-blackwhitelist:
     filter_file: /path/to/file
```

### API

Ọna `filter_metadata` naa yoo gba ọ laaye lati ya metadata ti o wa lati eyikeyi uplink sọtọ, o jẹ eyi to da lori `Ileri` ati pe o ni lati tun da metadata kanna pada pẹlu atunṣe.

> Do not remove properties from the metadata, try to do not mutate rather return a new object.

    interface IPluginStorageFilter<T> extends IPlugin<T> {
        filter_metadata(packageInfo: Package): Promise<Package>;
    }