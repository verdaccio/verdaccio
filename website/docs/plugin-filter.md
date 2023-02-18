---
id: plugin-filter
title: 'Filter Plugin'
---

## What's an Filter Plugin? {#whats-an-storage-plugin}

:::caution

Filter plugins are **experimental** and requires more users feedback

:::caution

### When to use a filter plugin? {#when-to-use}

If you need to mutate the metadata for different reasons this is a way to do it, all manifest request are intercepted, but the tarballs, user, profile or tokens requests are not included.

### Plugin structure {#build-structure}

The plugin only has one async method named `filter_metadata` that reference of the manifest and must return a copy (or modified object but not recommended) of the metadata.

````ts
export default class VerdaccioMiddlewarePlugin implements IPluginStorageFilter<CustomConfig> {
   async filter_metadata(metadata: Readonly<Manifest>): Promise<Package> {
    // modify the metadata
    const newMetadata = {...metadata, ...{name: 'fooName' }};
    return newMetadata;
  }
}
```
````
