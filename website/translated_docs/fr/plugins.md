---
id: plugins
title: "Plugins"
---
Verdaccio est une application extensible. Il peut être étendu par de nombreuses manières, ou avec de nouvelles méthodes d'authentification, en ajoutant des points de terminaison ou en utilisant un archivage personnalisé.

> Si vous souhaitez développer votre plugin personnel, lisez la section [development](dev-plugins.md).

## Utilisation

### Installation

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` étant une fourchette de sinopia, est compatible avec les versions précédentes et avec les plugins compatibles avec `sinopia@1.4.0`. Dans ce cas, l'installation est la même.

    $> npm install --global sinopia-memory
    

### Configuration

Ouvrez le fichier `>config.yaml` et mettez à jour la section `auth` comme suit :

La configuration par défaut ressemble à ceci, car nous utilisons un plugin intégré `htpasswd` qui peut être désactivé en commentant les lignes suivantes.

### Configuration du Plugin d'authentification

```yaml
 htpasswd:
    file: ./htpasswd
    #max_users: 1000
```

et en les remplaçant par (si vous décidez d'utiliser un plugin `ldap`.

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Plugins d'authentification multiples

Ceci est techniquement possible, en accordant de l'importance à l'ordre du plug-in, car les informations d'identification seront résolues dans l'ordre.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    #max_users: 1000
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

### Configuration du plugin Middleware

Ceci est un exemple de la façon de configurer un plugin middleware. Tous les plugins middleware doivent être définis dans l'espace de noms **middlewares**.

```yaml
middlewares:
  audit:
    enabled: true
```

> Vous pouvez suivre le [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) comme exemple de base.

### Configuration du plugin store

Ceci est un exemple de la façon de configurer un plugin de stockage. Tous les plugins de stockage doivent être définis dans l'espace de noms **store**.

```yaml
store:
  memory:
    limit: 1000
```

> Si vous définissez un magasin personnalisé, la propriété **stockage** du fichier de configuration sera ignorée.

## Plugins hérités

### Sinopia Plugins

(compatible avec toutes les versions)

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): plugin d'authentification pour la prise en charge de sinopia avec un journal npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): plugin d'authentification pour sinopia qui se souvient des utilisateurs.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): auth plugin for sinopia supporting atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Active Directory authentication plugin for sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): authentication plugin for sinopia2, supporting github oauth web flow.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Sinopia authentication plugin that delegates authentication to another HTTP URL
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alternate LDAP Auth plugin for Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): An easy and fully auth-plugin with configuration to use an external API.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Generate password in htaccess format, encrypt with GPG and send via MailGun API to users.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): An easy and fully auth-plugin with configuration to use a mongodb database.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): auth plugin for sinopia supporting htpasswd format.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): a leveldb backed auth plugin for sinopia private npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): Gitlab authentication plugin for sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): Gitlab authentication plugin for sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): LDAP auth plugin for sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Sinopia authentication plugin with github oauth web flow.

> All sinopia plugins should be compatible with all future verdaccio versions. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

## Verdaccio Plugins

(compatible since 2.1.x)

### Authorization Plugins

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket): Bitbucket authentication plugin for verdaccio.
* [verdaccio-bitbucket-server](https://github.com/oeph/verdaccio-bitbucket-server): Bitbucket Server authentication plugin for verdaccio.
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap): LDAP auth plugin for verdaccio.
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory): Active Directory authentication plugin for verdaccio
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab): use GitLab Personal Access Token to authenticate
* [verdaccio-gitlab-ci](https://github.com/lab360-ch/verdaccio-gitlab-ci): Enable GitLab CI to authenticate against verdaccio.
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd): Auth based on htpasswd file plugin (built-in) for verdaccio
* [verdaccio-github-oauth](https://github.com/aroundus-inc/verdaccio-github-oauth): Github oauth authentication plugin for verdaccio.
* [verdaccio-github-oauth-ui](https://github.com/n4bb12/verdaccio-github-oauth-ui): GitHub OAuth plugin for the verdaccio login button.

### Middleware Plugins

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit): verdaccio plugin for *npm audit* cli support (built-in) (compatible since 3.x)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api): verdacci plugin for *npm profile* cli support and *npm profile set password* for *verdaccio-htpasswd* based authentificaton

### Storage Plugins

(compatible since 3.x)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Storage plugin to host packages in Memory
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) Storage plugin to host packages **Amazon S3**
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) Storage plugin to host packages **Google Cloud Storage**

## Caveats

> Not all these plugins are been tested continuously, some of them might not work at all. Please if you found any issue feel free to notify the owner of each plugin.