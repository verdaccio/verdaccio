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

Ceci est techniquement possible, en accordant de l'importance à l'ordre du plugin, car les informations d'identification seront résolues dans l'ordre.

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
* [ sinopia-crowd ](https://www.npmjs.com/package/sinopia-crowd): plugin d'authentification pour sinopia qui prend en charge le public atlassien.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): plugin d'authentification Ative Directory pour sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): plugin d'authentification pour sinopia2, prenant en charge le flux web github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): plugin d’authentification Sinopia qui délègue l’authentification vers une autre URL HTTP
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): plugin remplaçant LDAP Auth pour Sinopia
* [sinopia-demande](https://www.npmjs.com/package/sinopia-request): un facile auth-plugin, entier, avec configuration pour utiliser une API externe.
* [sinopia-htaccess-gpg-mail](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): générer le mot de passe au format htaccess, chiffrer avec GPG et envoyer via l’API MailGun pour les utilisateurs.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): un facile auth-plugin, entier, avec configuration pour utiliser une base de données mongodb.
* [ sinopia-crowd ](https://www.npmjs.com/package/sinopia-htpasswd): plugin d'authentification pour sinopia qui prend en charge le format htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): plugin auth pris en charge par leveldb pour la synchronisation privée npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): plugin d'authentification Gitlab pour sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): plugin d'authentification Gitlab pour sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): plugin d'authentification LDAP pour sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) plugin d'authentification pour Sinopia avec une interface Web github oauth.

> Tous les plugins de Sinopia devraient être compatibles avec toutes les futures versions de Verdaccio. Cependant, nous encourageons les contributeurs à les transférer vers l’API moderne de verdaccio et à utiliser le préfixe * verdaccio-xx-name *.

## Plugins de Verdaccio

(compatible depuis 2.1.x)

### Plugins d'Autorisation

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket): plugin d'authentification Bitbucket pour verdaccio.
* [verdaccio-bitbucket-server](https://github.com/oeph/verdaccio-bitbucket-server): plugin d'authentification du serveur Bitbucket pour verdaccio.
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap): plugin d'authentification LDAP pour verdaccio.
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory): plugin d'authentifiation Active Directory pour verdaccio
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab): utilisez les Jetons d'Accès Personnel GitLab pour votre authentification
* [verdaccio-gitlab-ci](https://github.com/lab360-ch/verdaccio-gitlab-ci): permettre GitLab CI d'authentifier contre verdaccio.
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd): authentification basée sur le plugin du fichier htpasswd (built-in) pour verdaccio
* [verdaccio-github-oauth](https://github.com/aroundus-inc/verdaccio-github-oauth): plugin d'authentification Github oauth pour verdaccio.
* [verdaccio-github-oauth-ui](https://github.com/n4bb12/verdaccio-github-oauth-ui): plugin de Github OAuth pour le boutton de connexion de verdaccio.

### Plugins Middleware

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit): plugin verdaccio pour le support de *npm audit* (intégré) (compatible à partir de 3.x)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api): plugin verdaccio pour le support client *profil npm* et *Le profil npm du mot de passe* pour l'authentification basée sur *verdaccio-htpasswd*

### Plugins de stockage

(compatible depuis 3.x)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Des plugins de stockage pour héberger des packages en mémoire
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) plugin de stockage pour héberger les packages **Amazon S3**
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) plugin de stockage pour héberger les packages **Stockage Google Cloud**

## Avertissements

> Ces plugins ne sont pas tous testés de manière continue, certains peuvent ne pas fonctionner du tout. Si vous rencontrez un problème, veuillez en informer le propriétaire du plugin en question.