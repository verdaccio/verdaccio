---
id: plugins
title: "Plugins"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Autenticação](plugin-auth.md)
* [Midleware](plugin-middleware.md)
* [Armazenamento](plugin-storage.md)
* Custom Theme and filters

> Se você estiver interessado em desenvolver o seu próprio plugin, leia a seção sobre [desenvolvimento](dev-plugins.md).

## Utilização

### Instalação

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio`, como um fork de sinopia, tem compatibilidade com plugins que são compatíveis com `sinopia@1.4.0`. Neste caso, a instalação é a mesma.

```
$> npm install --global sinopia-memory
```

### Configuração

Open the `config.yaml` file and update the `auth` section as follows:

The default configuration looks like this, due we use a build-in `htpasswd` plugin by default that you can disable just commenting out the following lines.


### Configuração de Autenticação

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

and replacing them with (in case you decide to use a `ldap` plugin.

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Plugins de Multipla Autenticação

This is technically possible, making the plugin order important, as the credentials will be resolved in order.

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

### Configuração de Middleware

Este é um exemplo de como configurar um plugin de middleware. Todos os plugins de middleware devem ser definidos no **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> Você pode seguir o [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) como exemplo básico.

### Configuração de Armazenamento

Este é um exemplo de como configurar um plugin de armazenamento. Todos os plugins de armazenamento devem ser definidos no **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

### Configuração de Tema

O Verdaccio permite substituir a interface do usuário por uma personalizada, chamamos de **tema** (theme). Por padrão, usa-se o tema integrado `@verdaccio/ui-theme`, mas você pode usar algo diferente instalando seu próprio plugin.

```bash

$> npm install --global verdaccio-theme-dark

```

> O prefixo do nome do plugin deve começar com `verdaccio-theme`, caso contrário o plugin não carregará.


You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

## Plugins Legados

### Sinopia Plugins

> Se você está contando com qualquer plugin para sinopia, lembre-se de que eles estão obsoletos e podem não funcionar no futuro.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): auth plugin for sinopia supporting an npm registry.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): auth plugin for sinopia that keeps users in memory.
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

