---
id: paquets
title: "Paquet d'accès"
---
Il s'agit d'une série de restrictions qui permettent ou restreignent l'accès au stockage local en fonction de critères spécifiques.

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

La liste des groupes valides selon les plugins par défaut sont

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

All users recieve all those set of permissions independently of is anonymous or not plus the groups provided by the plugin, in case of `htpasswd` return the username as a group. For instance, if you are logged as `npmUser` the list of groups will be.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

If you want to protect specific set packages under your group, you need to do something like this. Let's use a `Regex` that covers all prefixed `npmuser-` packages. We recomend using a prefix for your packages, in that way it will be easier to protect them.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Restart `verdaccio` and in your console try to install `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

You can change the existing behaviour using a different plugin authentication. `verdaccio` just checks whether the user that tried to access or publish a specific package belongs to the right group.

#### Set multiple groups

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

#### Blocking access to set of packages

If you want to block the acccess/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Bloquer la transmission d'un groupe de paquets spécifiques

Vous voudrez peut-être empêcher les registres distants d’atteindre un ou plusieurs paquets tout en autorisant les autres à accéder à différentes *uplinks*.

Voyons l’exemple suivant:

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

Décrivons ce que nous voulons avec l'exemple ci-dessus:

* Je souhaite héberger ma propre dépendance `jquery` mais je dois éviter de la transférer.
* Je veux toutes les dépendances qui coïncident avec <`my-company - *` mais je dois éviter de les transférer.
* Je veux toutes les dépendances qui se trouvent dans la portée `my-local-scope`, mais je dois éviter de les transférer.
* Je veux transférer toutes les dépendances restantes.

**N'oubliez pas l'importance de la commande de colis et utilisez toujours le double astérisque**. Parce que si vous ne l'incluez pas, `verdaccio` l'inclura à votre place et cela affectera la manière dont vos dépendances seront résolues.

### Configuration

Vous pouvez définir mutiple `packages` et chacun d’eux doit avoir un unique `Regex`. La syntaxe est basée sur [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Propriété | Type                 | Obligatoire | Exemple        | Soutien | Description                                        |
| --------- | -------------------- | ----------- | -------------- | ------- | -------------------------------------------------- |
| accès     | chaîne de caractères | Non         | $all           | tous    | définir des groupes autorisés à accéder au package |
| publier   | chaîne               | Non         | $authenticated | tous    | définir les groupes autorisés à publier            |
| proxy     | chaîne de caractères | Non         | npmjs          | tous    | limite la recherche d'un uplink spécifique         |
| stockage  | booléenne            | Non         | [vrai,faux]    | tous    | TODO                                               |

> Nous vous signalons qu'il est déconseillé d'utiliser les **allow_access **/**allow_publish** et les **proxy_access** qui sont obsolètes et qui seront bientôt supprimés. version courte de chacun de ces éléments (**acces**/ **publish**/**proxy**).