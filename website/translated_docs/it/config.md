---
id: configuration
title: "File di configurazione"
---
Questo file è il fondamento di verdaccio dove è possibile modificare il comportamento predefinito, attivare i plugin ed estendere le funzionalità.

Un file di configurazione predefinito viene creato la prima volta che si esegue `verdaccio`.

## Configurazione predefinita

La configurazione predefinita dispone del supporto per pacchetti ** scoped** e permette a qualsiasi utente di accedere a tutti i pacchetti ma solo **agli utenti autenticati di pubblicare**.

```yaml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
  '**':
    proxy: npmjs
logs:
  - {type: stdout, format: pretty, level: http}
```

## Sezioni

Le sezioni seguenti spiegano cosa significa ogni proprietà e le diverse opzioni.

### Archiviazione

È il percorso di archiviazione predefinito. **Verdaccio è di default basato sul file locale di sistema**.

```yaml
storage: ./storage
```

### Plugin

È il percorso della directory dei plugin. Utile per distribuzioni basate su Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Autenticazione

L'impostazione dell'autenticazione viene fatta qui, l'autenticazione predefinita è basata su `htpasswd` ed è incorporata. È possibile modificare questo comportamento tramite [plugin](plugins.md). Per ulteriori informazioni su questa sezione leggere la [ pagina dell'autenticazione](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

Questa proprietà consente di modificare le caratteristiche dell'interfaccia utente web. Per ulteriori informazioni su questa sezione, leggere la [pagina dell'interfaccia utente web](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Uplink

Uplinks è la capacità del sistema di recuperare i pacchetti da registri remoti quando quei pacchetti non sono disponibili localmente. Per ulteriori informazioni su questa sezione leggere la [ pagina uplinks](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Pacchetti

Pacchetti consente all'utente di controllare come i pacchetti vengono resi accessibili. Per ulteriori informazioni su questa sezione leggere [pacchetti pagina](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Impostazioni avanzate

### Pubblicazione non in linea

Per impostazione predefinita `verdaccio` non consente di pubblicare quando il client è offline, questo comportamento può essere modificato impostandola su *true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### Prefisso URL

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Dimensione massima del corpo

Per impostazione predefinita la dimensione massima del corpo per un documento JSON è di `10mb`, se si incontrano errori come `"entità richiesta troppo grande"` si può aumentare questo valore.

```yaml
max_body_size: 10mb
```

### Porta in ascolto

`verdaccio` viene eseguita per impostazione predefinita nella porta `4873`. Modifica della porta può essere fatta tramite [cli](cli.md) o nel file di configurazione, le seguenti opzioni sono valide.

```yaml
listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

Per abilitare `https` in `verdaccio` è sufficiente impostare il tag `ascolto` con il protocollo *https://*. Per ulteriori informazioni su questa sezione leggere la [ pagina del ssl](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

I proxy sono speciali HTTP Server progettati per trasferire dati da server remoti ai clienti locali.

#### http_proxy and https_proxy

Se avete un proxy nella rete è possibile impostare un'intestazione di `X-Forwarded-For` utilizzando le seguenti proprietà.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Questa variabile deve contenere un elenco di estensioni di dominio separate da virgole per cui il proxy non deve essere utilizzato.

```yaml
no_proxy: localhost,127.0.0.1
```

### Notifiche

Enabling notifications to third-party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Per impostazioni di configurazione più dettagliate, si prega di [controllare la fonte del codice](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` è un nuovo comando rilasciato con [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio include un plugin di middleware incorporato per gestire questo comando.

> Se si dispone di una nuova installazione viene fornito di default, altrimenti è necessario aggiungere le seguenti proprietà al file di configurazione

```yaml
middlewares:
  audit:
    enabled: true
```