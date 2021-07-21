---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Verdaccio and deterministic lock files
---

![](https://cdn-images-1.medium.com/max/1024/1*igz5Q878nju28EAa6RJ_Xg.png)<figcaption>Snippet of some random lock file</figcaption>

**Lockfiles** on node package manager (npm) clients are not a new topic, yarn broke the node package managers world with a term called [**determinism**](https://yarnpkg.com/blog/2017/05/31/determinism/) providing a new file generated after install called yarn.lock to pin and freeze dependencies with the objective to avoid inconstancies across multiple installations.

If you are using a private registry as [Verdaccio](https://verdaccio.org/), it might be a concern committing the lock file in the repo using the private or local domain as registry URL and then someone else due his environment is not able to fetch the tarballs defined in the lock file.

This is merely an issue that all package managers have to resolve, nowadays is not hard to see companies using their own registry to host private packages or using the **Verdaccio** the power feature [uplinks](https://verdaccio.org/docs/en/uplinks) to resolve dependencies from more than one registry using one single endpoint.

<!--truncate-->

### How does a lock file look like? {#how-does-a-lock-file-look-like}

Lock file looks different based on the package manager you are using, in the case of npm as an example looks like this

```
"[@babel/code-frame](http://twitter.com/babel/code-frame)@7.0.0-beta.44":
 version "7.0.0-beta.44"
 resolved "[http://localhost:4873/@babel%2fcode-frame/-/code-frame-7.0.0-beta.44.tgz#2a02643368de80916162be70865c97774f3adbd9](http://localhost:4873/@babel%2fcode-frame/-/code-frame-7.0.0-beta.44.tgz#2a02643368de80916162be70865c97774f3adbd9)"
 dependencies:
 "[@babel/highlight](http://twitter.com/babel/highlight)" "7.0.0-beta.44"
```

The snippet above is just a small part of this huge file which nobody dares to deal when conflicts arise. However, I just want you to focus on a field called **resolved**.

#### Simple example with Verdaccio as localhost {#simple-example-with-verdaccio-as-localhost}

Let’s imagine you are using **Verdaccio** and **yarn** for local purposes and your registry configuration points to.

```
yarn config set registry http://localhost:4873/
```

After running an installation, yarn install, a lock file is generated and each dependency will have a field called resolved that points exactly the URI where tarball should be downloaded in a future install. That meaning the package manager will rely on such URI no matter what.

_In the case of pnpm the lock file looks a bit different, we will see that in detail later on this article._

```
// yarn.lock

math-random@^1.0.1:
 version "1.0.1"
 resolved "[http://localhost:4873/math-random/-/math-random-1.0.1.tgz#8b3aac588b8a66e4975e3cdea67f7bb329601fac](http://localhost:4873/math-random/-/math-random-1.0.1.tgz#8b3aac588b8a66e4975e3cdea67f7bb329601fac)"
```

Let’s imagine you that might want to change your domain where your registry is hosted and the resolved field still points to the previous location and your package manager won’t be able to resolve the project dependencies anymore.

**A usual solution is to delete the whole lock file and generate a new one** , but, this is not practical for large teams since will drive you to conflicts between branch hard to solve.

So, _How can I use a private registry avoiding the_ _resolved field issue?_. All clients handle this issue in a different way, let’s see how they do it.

### How does the resolved field is being used by …? {#how-does-the-resolved-field-is-being-used-by-}

![](https://cdn-images-1.medium.com/max/1024/1*kafHawK1RCt-LDsdGz6iUA.png)

npm uses a JSON as a format for the lock file. The good news is since **npm@5.0.0** [ignores the resolved field](http://blog.npmjs.org/post/161081169345/v500) on package-lock.json file and basically fallback to the one defined in the .npmrc or via --registry argument using the CLI in case is exist, otherwise, it will use the defined in the resolved field.

import { Tweet } from "react-twitter-widgets"

<Tweet tweetId="862834964932435969" options={{
  dnt: true,
  align: 'center'
}} />

Nowadays you can use the npm cli with lock file safely with Verdaccio independently the URL where tarball was served. But, I’d recommend to share a local .npmrc file with the registry set by default locally or notify your team about it.

![](https://cdn-images-1.medium.com/max/1024/1*0pWUcgRyhax5KVJKsnbgkA.png)

If you are using Yarn the story is a bit different. Until the version 1.9.4, it tries to resolve what lock file defines as a first option.

There are some references on PR, RFCs or tickets opened were they discuss how to address this problem properly and if you are willing to dive into this topic allow me to share the most interesting threads you might follow:

- Replace resolved field by hash [https://github.com/yarnpkg/rfcs/pull/64#issuecomment-414649518](https://github.com/yarnpkg/rfcs/pull/64#issuecomment-414649518)
- yarn.lock should not include base domain registry [https://github.com/yarnpkg/yarn/issues/3330](https://github.com/yarnpkg/yarn/issues/3330)
- Remove hostname from the lock files [https://github.com/yarnpkg/yarn/issues/5892](https://github.com/yarnpkg/yarn/issues/5892)

> TDLR; Yarn 2.0 [has planned to solve this issue](https://github.com/yarnpkg/yarn/projects/4#card-10080906) in the next major version, to this day sill [discussing what approach to take](https://github.com/yarnpkg/rfcs/pull/64#issuecomment-414163196).

![](https://cdn-images-1.medium.com/max/1012/1*Y3jjekoNQiujCccP3bNvTg.png)<figcaption><a href="https://pnpm.js.org/">https://pnpm.js.org/</a></figcaption>

[**pnpm**](https://pnpm.js.org/) follows the same approach as other package managers generating a lock file but, in this case, the file is being called shrinkwrap.yaml that is based in **yaml format.**

```
dependencies:
 jquery: 3.3.1
 parcel: 1.9.7
packages:
 /@mrmlnc/readdir-enhanced/2.2.1:
 dependencies:
 call-me-maybe: 1.0.1
 glob-to-regexp: 0.3.0
 dev: false
 engines:
 node: '\>=4'
 resolution:
 integrity: sha512-bPHp6Ji8b41szTOcaP63VlnbbO5Ny6dwAATtY6JTjh5N2OLrb5Qk/Th5cRkRQhkWCt+EJsYrNB0MiL+Gpn6e3g==
 tarball: /@mrmlnc%2freaddir-enhanced/-/readdir-enhanced-2.2.1.tgz

....

registry: '[http://localhost:4873/'](http://localhost:4873/')
shrinkwrapMinorVersion: 9
shrinkwrapVersion: 3
specifiers:
 jquery: ^3.3.1
 parcel: ^1.9.7
```

The example above is just a small snippet of how this long file looks like and you might observe that there is a field called [registry](https://github.com/pnpm/spec/blob/master/shrinkwrap/3.8.md#registry) added at the bottom of the lock file which [was introduced to reduce the file size of the lock file](https://github.com/pnpm/pnpm/issues/1072), in some scenarios pnpm decides to set [the domain is part of the tarball field](https://github.com/josephschmitt/pnpm-406-npmE).

**pnpm** will try to fetch dependencies using the registry defined within the lockfile as yarn **does**. However, as a workaround, if the domain changes you must update the registry field manually, it’s not hard to do but, is better than nothing.

pnpm has already opened a ticket to drive this issue, I’ll let below the link to it.

[Remove the "registry" field from "shrinkwrap.yaml" · Issue #1353 · pnpm/pnpm](https://github.com/pnpm/pnpm/issues/1353)

### Scoped Registry Workaround {#scoped-registry-workaround}

A common way to route private packages is route scoped dependencies through a different registry. This works on npm and pnpm

```
registry=[https://registry.npmjs.org](https://registry.npmjs.org/)
@mycompany:registry=http://verdaccio-domain:4873/
```

> It does exist any support for at the time of this writing.

In my opinion, this is just a workaround, which depends on the number or scopes you handle to decide whether or not worth it. Furthermore, the package manager will bypass those packages that do not match with the scope and won’t be resolved by your private registry.

### Conclusion {#conclusion}

**package managers** are working to solve this issues with backward compatibility and with good performance.

For now, the best solution if you share this concern is **using npm until the other clients decide what to do** or **following the recommendations above for each client**.

---
