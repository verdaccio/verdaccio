---
id: plugins
title: "Plugins"
---
Verdaccio je aplikacija koja podržava plugine. Može se proširivati na mnogo načina, dodavanjem novih metoda za autentifikaciju, dodavanjem endpoints-a ili korišćenjem custom storage-a.

> Ako ste zainteresovani da razvijete sopstveni plugin, pročitajte [development](dev-plugins.md) sekciju.

## Korišćenje

### Instalacija

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` je sinopia fork i poseduje backward compability sa pluginima koji su kompatibilni sa `sinopia@1.4.0`. Utom slučaju, instalacija je potpuno ista.

    $> npm install --global sinopia-memory
    

### Konfigurisanje

Otvorite `config.yaml` fajl i uradite update `auth` sekcije prema sledećim uputstvima:

Podrazumevana konfiguracija izgleda ovako, jer koristimo ugrađeni `htpasswd` plugin kao podrazumevan, a koji možete zaustaviti (disable) tako što ćete sledeće linije pretvoriti u komentar.

### Auth Plugin Configuration

```yaml
 htpasswd:
    file: ./htpasswd
    #max_users: 1000
```

i zameniti ih sa datim (ako se odlučite da koristite `ldap` plugin).

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Multiple Auth plugini

Tehnički je izvodivo, ako postavite da je redosled plugina važan, usled čega će se credentials izvršiti po tom poretku.

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

### Middleware Plugin Configuration

Ovo je primer koji pokzuje kako treba da podesite middleware plugin. Svi middleware plugini moraju biti definisani u **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> Možete pratiti [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) kao bazični primer.

### Store Plugin Configuration

Ovo je primer koji pokzuje kako treba da podesite storage plugin. Svi storage plugini moraju se definisati u **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

> Ako definišete custom store, svojstvo **storage** u configuration fajlu će biti ignorisano.

## Tradicionalni plugini (Legacy plugins)

### Sinopia Plugins

(kompatibilni sa svim verzijama)

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): auth plugin za sinopia koji podržava npm registry.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): auth plugin za sinopia koji čuva korisnike u memoriji.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): auth plugin za sinopia koji podržava atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Active Directory authentication plugin za sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): authentication plugin za sinopia2, podržava github oauth web flow.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Sinopia authentication plugin koji delegira authentifikaciju za drugi HTTP URL
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alternativni LDAP Auth plugin za Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Jednostavan i celovit auth-plugin sa konfiguracijom za korišćenjem eksternih API.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Generiše password u htaccess formatu, encrypt sa GPG i šalje preko MailGun API do korisnika.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Jednostavan i celovit auth-plugin sa konfiguracijom za korišćenje mongodb database.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): auth plugin za sinopia koji podržava htpasswd format.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): a leveldb podržan auth plugin za sinopia private npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): Gitlab authentication plugin za sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): Gitlab authentication plugin za sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): LDAP auth plugin za sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Sinopia authentication plugin sa github oauth web flow.

> Svi sinopia pluginsi, trebalo bi da budu kompatibilni sa svim budućim verzijama verdaccio-a. Bilo kako bilo, ohrabrujemo naše saradnike da pređu na moderni verdaccio API i da koriste prefiks kao *verdaccio-xx-name*.

## Verdaccio Plugins

(kompatibilno od verzije 2.1.x)

### Authorization Plugins

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket): Bitbucket authentication plugin za verdaccio.
* [verdaccio-bitbucket-server](https://github.com/oeph/verdaccio-bitbucket-server): Bitbucket Server authentication plugin za verdaccio.
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap): LDAP auth plugin za verdaccio.
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory): Active Directory authentication plugin za verdaccio
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab): koristi GitLab Personal Access Token za authentifikaciju
* [verdaccio-gitlab-ci](https://github.com/lab360-ch/verdaccio-gitlab-ci): Omogućava GitLab CI da authenticate protiv verdaccio.
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd): File plugin za Auth based on htpasswd (ugrađen), za verdaccio
* [verdaccio-github-oauth](https://github.com/aroundus-inc/verdaccio-github-oauth): Github oauth authentication plugin za verdaccio.
* [verdaccio-github-oauth-ui](https://github.com/n4bb12/verdaccio-github-oauth-ui): GitHub OAuth plugin za the verdaccio login dugme.

### Middleware Plugins

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit): verdaccio plugin za *npm audit* cli support (ugrađen) (kompatibilni od verzije 3.x)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api): verdacci plugin za *npm profile* cli support i *npm profile set password* za *verdaccio-htpasswd* baziranu autentifikaciju

### Storage Plugins

(kompatibilani od verzije 3.x)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Storage plugin za hostovanje paketa u Memory
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) Storage plugin za hostovanje paketa na **Amazon S3**
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) Storage plugin za hostovanje paketa na **Google Cloud Storage**

## Upozorenja (Caveats)

> Svi navedeni plugini nisu detaljno testirani i može se dogoditi da neki od njih uopšte ne rade. Ako naiđete na probleme, molimo Vas da slobodno pošaljete upit autorima plugina.