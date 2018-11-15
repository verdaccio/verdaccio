---
id: konfigurisanje
title: "Fajl za konfigurisanje"
---
Ovaj fajl je osnova verdaccio-a. U okviru njega, možete vršiti izmene zadatih podešavanja, možete aktivirati plugin-e i spoljašnje resurse (features).

Fajl "default configuration file" se kreira prilikom prvog pokretanja `verdaccio-a`.

## Podrazumevane postavke (Default Configuration)

Podrazumevane postavke podržavaju **scoped** pakete za sve korisnike, ali samo **autorizovanim korisnicima omogućavaju da publikuju**.

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

## Sekcije

Sekcija u nastavku daje objašnjenja za svako svojstvo i opciju.

### Memorija za skladištenje

Je lokacija na kojoj se vrši skladištenje podataka. **Verdaccio je inicijalno podešen kao local file system**.

```yaml
storage: ./storage
```

### Plugins

Je lokacija plugin directorijuma. Ovo je korisno za deployment baziran na Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Autentifikacija

Ovde se vrši podešavanje (set up). Podrazumevana auth je bazirana na `htpasswd` i već je ugrađena. Možete izvršiti modifikacije načina rada (behaviour) putem [plugin-a](plugins.md). Za više informacija o ovoj sekciji pročitajte [auth stranu](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI (korisnički interfejs)

Ovo svojstvo Vam omogućava da steknete uvid u web UI. Za više informacija o ovoj sekciji, pročitajte [web ui stranicu](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Uplinks

Uplinks pružaju mogućnost sistemu da hvata (fetch) pakete iz udaljenih registrija ako ti paketi nisu lokalno dostupni. Za više informacija o ovoj sekciji pročitajte na [uplinks stranici](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Paketi

Paketi (packages) daju mogućnost korisnicima da kontrolišu kako će se pristupati paketima. Za više detalja o ovoj sekciji, pročitajte [packages stranicu](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Napredna podešavanja

### Publikovanje offline

Prema zadatim podešavanjima, `verdaccio` ne dozvoljava publikovanje onda kada je klijent offline. Takav način rada (behavior), može da se promeni ako se ovo iz primera podesi na *true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### URL Prefix

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Maksimalna veličina body sekcije dokumenta

Prema zadatim podešavanjima, maksimalna veličina za body JSON dokumenta je `10mb`. Ako dobijete grešku `"request entity too large"` mogli biste da povećate ovu vrednost.

```yaml
max_body_size: 10mb
```

### Listen Port

`verdaccio` prema "fabričkim podešavanjima" radi na portu `4873`. Izmena porta se može obaviti preko [cli](cli.md) ili direktno u fajlu za konfigurisanje pri čemu su sledeće opcije validne:

```yaml
listen:
# - localhost:4873            # podrazumevano
# - http://localhost:4873     # apsolutno isto
# - 0.0.0.0:4873              # listen na svim adresama (INADDR_ANY)
# - https://example.org:4873  # ako želite da koristite https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

Kako biste omogućili `https` u`verdaccio` dovoljno je da podesite `listen` flag sa protokolom *https://*. Više detalja možete naći na [ssl stranici](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxies su HTTP serveri posebne namene dizajnirani da prenose podatke od udaljenih servera do lokalnih klijenata.

#### http_proxy i https_proxy

Ako imate proxy u svojoj mreži, možete podesiti `X-Forwarded-For` header koristeći sledeće unose za svojstva (properties).

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Ova varijabla bi trebalo da sadrži comma-separated listu ekstenzija domena za koju proxy ne bi trebalo da se koristi.

```yaml
no_proxy: localhost,127.0.0.1
```

### Notifikacije

Dozvoljavanje notifikacija za alate napravljene od strane trećih lica je relativno jednostavno uz pomoć web hooks. Za više informacija o ovoj temi, pročitajte [notifications stranicu](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Za detaljnije opcije podešavanja, molimo Vas da [pogledate source code](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit (revizija)

<small>Počevši od: <code>verdaccio@3.0.0</code></small>

`npm audit` je nova komanda koja je uvedena u [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio, a koja uključuje ugrađeni middleware plugin bez koga je nemoguće izvršiti datu komandu.

> Ako imate novu instalaciju, sve je već uključeno u okviru nje. U suprotnom, treba da dodate navedene props u Vaš config fajl

```yaml
middlewares:
  audit:
    enabled: true
```