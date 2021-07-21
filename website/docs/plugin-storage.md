---
id: plugin-storage
title: "Storage Plugin"
---

## What's an Storage Plugin? {#whats-an-storage-plugin}

Verdaccio by default uses a file system storage plugin [local-storage](https://github.com/verdaccio/local-storage). The default storge can be easily replaced, either using a community plugin or creating one by your own.

### API {#api}

Storage plugins are composed of two objects, the `IPluginStorage<T>` and the `IPackageStorage`.

* The `IPluginStorage` object handle the local database for private packages.

```typescript
  interface IPluginStorage<T> extends IPlugin<T>, ITokenActions {
    logger: Logger;
    config: T & Config;
    add(name: string, callback: Callback): void;
    remove(name: string, callback: Callback): void;
    get(callback: Callback): void;
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<any>;
    getPackageStorage(packageInfo: string): IPackageStorage;
    search(onPackage: onSearchPackage, onEnd: onEndSearchPackage, validateName: onValidatePackage): void;
  }
```
* The `IPackageStorage` is an object that is created by each request that handles the I/O actions for the metadata and tarballs.

```typescript
interface IPackageStorage {
  logger: Logger;
  writeTarball(pkgName: string): IUploadTarball;
  readTarball(pkgName: string): IReadTarball;
  readPackage(fileName: string, callback: ReadPackageCallback): void;
  createPackage(pkgName: string, value: Package, cb: CallbackAction): void;
  deletePackage(fileName: string, callback: CallbackAction): void;
  removePackage(callback: CallbackAction): void;
  updatePackage(
    pkgFileName: string,
    updateHandler: StorageUpdateCallback,
    onWrite: StorageWriteCallback,
    transformPackage: PackageTransformer,
    onEnd: CallbackAction
  ): void;
  savePackage(fileName: string, json: Package, callback: CallbackAction): void;
}
```

## Generate an middleware plugin {#generate-an-middleware-plugin}

For detailed info check our [plugin generator page](plugin-generator). Run the `yo` command in your terminal and follow the steps.

```
➜ yo verdaccio-plugin

Just found a `.yo-rc.json` in a parent directory.
Setting the project root at: /Users/user/verdaccio_yo_generator

     _-----_     ╭──────────────────────────╮
    |       |    │        Welcome to        │
    |--(o)--|    │ generator-verdaccio-plug │
   `---------´   │   in plugin generator!   │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? What is the name of your plugin? custom-endpoint
? Select Language typescript
? What kind of plugin you want to create? storage
? Please, describe your plugin awesome storage plugin
? GitHub username or organization myusername
? Author's Name Juan Picado
? Author's Email jotadeveloper@gmail.com
? Key your keywords (comma to split) verdaccio,plugin,storage,awesome,verdaccio-plugin
   create verdaccio-plugin-storage-package-database/package.json
   create verdaccio-plugin-storage-package-database/.gitignore
   create verdaccio-plugin-storage-package-database/.npmignore
   create verdaccio-plugin-storage-package-database/jest.config.js
   create verdaccio-plugin-storage-package-database/.babelrc
   create verdaccio-plugin-storage-package-database/.travis.yml
   create verdaccio-plugin-storage-package-database/README.md
   create verdaccio-plugin-storage-package-database/.eslintrc
   create verdaccio-plugin-storage-package-database/.eslintignore
   create verdaccio-plugin-storage-package-database/src/PackageStorage.ts
   create verdaccio-plugin-storage-package-database/src/index.ts
   create verdaccio-plugin-storage-package-database/src/plugin.ts
   create verdaccio-plugin-storage-package-database/index.ts
   create verdaccio-plugin-storage-package-database/tsconfig.json
   create verdaccio-plugin-storage-package-database/types/index.ts
   create verdaccio-plugin-storage-package-database/.editorconfig

I'm all done. Running npm install for you to install the required dependencies. If this fails, try running the command yourself.


⸨ ░░░░░░░░░░░░░░░░░⸩ ⠋ fetchMetadata: sill pacote range manifest for @babel/plugin-syntax-jsx@^7.7.4 fetc
```

### List Community Storage Plugins {#list-community-storage-plugins}

The following list of plugins are implementing the Storage API and might be used them as example.

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Storage plugin to host packages in Memory
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) Storage plugin to host packages **Amazon S3**
* [verdaccio-aws-s3-storage](https://github.com/verdaccio/monorepo/tree/master/plugins/aws-s3-storage) Storage plugin to host packages **Amazon S3** (maintained by Verdaccio core team)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) Storage plugin to host packages **Google Cloud Storage**
* [verdaccio-minio](https://github.com/barolab/verdaccio-minio) A verdaccio plugin for storing data in Minio
* [verdaccio-offline-storage](https://github.com/g3ngar/verdaccio-offline-storage)   local-storage plugin BUT with locally available packages as first class citizens.
