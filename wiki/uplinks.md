# Uplinks

An *upnlink* is a link with an external registry that provides acccess to external packages. 
 
```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```    
### Configuration

You can define mutiple uplinks and each of them must have an unique name (key). They can have two properties:

Property | Type | Required | Example | Support | Description
--- | --- | --- | --- | --- | ---
url | string | Yes | https://registry.npmjs.org/ | all | The registry url
timeout | string | No | 100ms | all | set new timeout
cache | boolean | No |[true,false] | >= 2.1 | avoid cache tarballs

### You Must know

* Add uplinks might slow down the lookup of your packages.
* Uplinks must be registries compatible with the `npm` endpoints. Eg: *verdaccio*, *sinopia@1.4.0*, *npmjs registry*, *yarn registry* and more.
* Setting `cache` to false will help to save space in your hard drive.