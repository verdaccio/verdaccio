---
id: paquets
title: "Paquet d'accès"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

Les restrictions de sécurité dépendent du plugin que vous utilisez. `verdaccio` utilise par défaut le plugin [htpasswd](https://github.com/verdaccio/verdaccio-htpasswd). Si vous utilisez un autre plugin, l'opération peut être différente. Le plugin par défaut ne gère pas directement `allow_access` et `allow_publish`, mais utilise une alternative interne au cas où le plugin ne serait pas prêt pour cela.

Pour plus d'informations sur les autorisations, consultez la [section d'authentification du wiki](auth.md).

### Utilisation

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: $all
    publish: $all
    proxy: server2

  'private-*':
    access: $all
    publish: $all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: $all
    publish: $all
    proxy: uplink2
```

si rien n'est spécifié, le choix est par défaut

```yaml
packages:
  '**':
    access: $all
    publish: $authenticated
```

The list internal groups handled by `verdaccio` are:

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Tous les utilisateurs reçoivent tous ces groupes d'autorisations, qu'ils soient anonymes ou non, plus les groupes fournis par le plug-in. Dans le cas `htpasswd`, rejetez le nom d'utilisateur en tant que groupe. Par exemple, si vous êtes connectés en tant que `npmUser`, la liste des noms sera.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Si vous souhaitez protéger un ensemble spécifique de paquets au sein de votre groupe, vous devez procéder de la même manière. Utilisons un `Regex` qui couvre tous les paquets avec le préfixe `npmuser -`. We recommend using a prefix for your packages, in that way it will be easier to protect them.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Redémarrez `verdaccio` et essayez d'installer `npmuser-core` dans votre console.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Vous pouvez changer le comportement existant en utilisant un autre plugin d'authentification. `verdaccio` vérifie simplement si l'utilisateur qui a tenté d'accéder ou de publier un paquet spécifique appartient au groupe approprié.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Définir plusieurs groupes

Defining multiple access groups is fairly easy, just define them with a white space between them.

```yaml
  'company-*':
    access: admin internal
    publish: admin
    proxy: server1
  'supersecret-*':
    access: secret super-secret-area ultra-secret-area
    publish: secret ultra-secret-area
    proxy: server1
```

#### Bloquer l’accès à l’ensemble des paquets

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Bloquer la transmission d'un groupe de paquets spécifiques

You might want to block one or several packages from fetching from remote repositories., but, at the same time, allow others to access different *uplinks*.

Let's see the following example:

```yaml
packages:
  'jquery':
    access: $all
    publish: $all
  'my-company-*':
    access: $all
    publish: $authenticated
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

Let's describe what we want with the above example:

* Je souhaite héberger ma propre dépendance `jquery` mais je dois éviter de la transférer.
* Je veux toutes les dépendances qui coïncident avec <`my-company - *` mais je dois éviter de les transférer.
* Je veux toutes les dépendances qui se trouvent dans la portée `my-local-scope`, mais je dois éviter de les transférer.
* Je veux transférer toutes les dépendances restantes.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

#### Use multiple uplinks

You may assign multiple uplinks for use as a proxy to use in the case of failover, or where there may be other private registries in use.

```yaml
'**':
  access: $all
  publish: $authenticated
  proxy: npmjs uplink2
```

#### Unpublishing Packages

The property `publish` handle permissions for `npm publish` and `npm unpublish`.  But, if you want to be more specific, you can use the property `unpublish` in your package access section, for instance:

```yalm
packages:
  'jquery':
    access: $all
    publish: $all
    unpublish: root
  'my-company-*':
    access: $all
    publish: $authenticated
    unpublish:
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
    # unpublish: property commented out
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

In the previous example, the behaviour would be described:

* all users can publish the `jquery` package, but only the user `root` would be able to unpublish any version.
* only authenticated users can publish `my-company-*` packages, but **nobody would be allowed to unpublish them**.
* If `unpublish` is commented out, the access will be granted or denied by the `publish` definition.


### Configuration

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Propriété | Type   | Obligatoire | Exemple        | Soutien        | Description                                                               |
| --------- | ------ | ----------- | -------------- | -------------- | ------------------------------------------------------------------------- |
| accès     | chaîne | Non         | $all           | tous           | définir des groupes autorisés à accéder au package                        |
| publier   | chaîne | Non         | $authenticated | tous           | définir les groupes autorisés à publier                                   |
| proxy     | chaîne | Non         | npmjs          | tous           | limite la recherche d'un uplink spécifique                                |
| stockage  | chaîne | Non         | chaîne         | `/some-folder` | it creates a subfolder whithin the storage folder for each package access |

> Nous vous signalons qu'il est déconseillé d'utiliser les **allow_access **/**allow_publish** et les **proxy_access** qui sont obsolètes et qui seront bientôt supprimés. version courte de chacun de ces éléments (**acces**/ **publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
