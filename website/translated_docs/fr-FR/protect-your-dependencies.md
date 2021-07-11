---
id: protect-your-dependencies
title: "Protection des paquets"
---

Verdaccio allows you protect publishing to your registry. To achieve that you will need to set up correctly configure your [packages access](packages).

### Configuration du paquet

Voyons, par exemple, la configuration suivante. You have a set of dependencies that are prefixed with `my-company-*` and you need to protect them from anonymous or other non-authorized logged-in users.

```yaml
"my-company-*":
  access: admin teamA teamB teamC
  publish: admin teamA
```

With this configuration, we allow the groups **admin** and **teamA** to *publish* and **teamA**, **teamB** and **teamC** to *access* the specified dependencies.

### Use case: teamD tries to access the dependency

So, if I am logged as **teamD**. I shouldn't be able to access all dependencies that match the `my-company-*` pattern.

```bash
➜ npm whoami
teamD
```

I won't have access to such dependencies and they also won't be visible via the web interface for user **teamD**. If I try to access it, the following will happen:

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! code E403
npm ERR!
```

or with `yarn`:

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 🔍  Resolving packages...
error Une erreur inattendue s'est produite: "http: // localhost: 5555 / webpack-1: les utilisateurs non enregistrés ne sont pas autorisés à accéder au paquet my-company-core".
```
