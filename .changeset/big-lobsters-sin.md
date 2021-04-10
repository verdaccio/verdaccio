---
'@verdaccio/local-storage': major
'@verdaccio/url': major
'verdaccio-aws-s3-storage': major
'verdaccio-google-cloud': major
'verdaccio-memory': major
'@verdaccio/store': major
---

# async storage plugin bootstrap

Gives a storage plugin the ability to perform asynchronous tasks on initialization

## Breaking change

Plugin must have an init method in which asynchronous tasks can be executed

```js
public async init(): Promise<void> {
   this.data = await this._fetchLocalPackages();
   this._sync();
}
```
