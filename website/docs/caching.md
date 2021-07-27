---
id: caching
title: "Caching strategies"
---

Verdaccio caches all packages by default into the `/storage` folder. But you can decide whether you want to follow
a different strategy. Using of plugins you might use the cloud or any sort of database.

## Caching scenarios {#caching-scenarios}

* Build a Node.js project on **Continous Integration** (Bamboo, GitLab, Jenkins, etc) servers is a task that might take several times at a day, thus, the server will download tons of tarballs from the registry every time takes place.  As usual, the CI tools clear the cache after each build and the process start over and over again. That is a waste of bandwidth and reduces the external traffic.
**You can use Verdaccio for caching tarballs and metadata in our internal network and give a boost in your build time.**
* **Latency and Connectivity**, not all countries enjoy a high-speed connection. For such reason cache packages locally in your network
is really handy. Either if you are traveling, or have a weak connection, roaming or countries with strong Firewalls that might affect the user experience (eg: corrupting tarballs).
* **Offline Mode**, all Node Package Managers nowadays uses their own internal cache, but it common that different projects might use
different tools, which implies lock files and so on. Those tools are unable to share cache, the unique solution is centralized and relies on
a proxy registry, Verdaccio cache all metadata and tarballs are downloaded by demand being able to share them across all your project.
* Avoid that any remote registry suddenly returns *HTTP 404* error for tarballs were previously available a.k.a ([left-pad issue](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)).


# Strategies for faster builds

> We are looking for more strategies, feel free to share your experience in this field

## Avoid Caching tarballs {#avoid-caching-tarballs}

If you have a limited storage space, you might need to avoid cache tarballs, enabling `cache` false in each
uplink will cache only metadata files.

```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    cache: false
```

## Extending Cache Expiration Time {#extending-cache-expiration-time}

 Verdaccio by default waits 2 minutes to invalidate the cache metadata before fetching new information from the remote registry.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 30m
```

Increasing the value of `maxage` in each `uplink` remotes will be asked less frequently. This might be a valid strategy if
you don't update dependencies so often.


## Using the memory instead the hardrive {#using-the-memory-instead-the-hardrive}

Sometimes caching packages is not a critical step, rather than route packages from different registries and achieving
faster build times. There are two plugins that avoid write in a physical hard drive at all using the memory.

```bash
  npm install -g verdaccio-auth-memory
  npm install -g verdaccio-memory
```

The configuration looks like this

```yaml
auth:
  auth-memory:
    users:
      foo:
        name: test
        password: test
store:
  memory:
    limit: 1000
```

Remember, once the server is restarted the data is being lost, we recommend this setup in cases where you do not
need to persist at all.
