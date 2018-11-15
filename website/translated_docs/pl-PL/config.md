---
id: konfiguracja
title: "Plik konfiguracyjny"
---
Plik ten jest podstawą verdaccio, ponieważ to w nim możesz modyfikować domyślne zachowanie aplikacji, rozszerzać jej funkcje oraz włączać wtyczki.

Domyślny plik konfiguracyjny jest tworzony, gdy po raz pierwszy uruchomisz `verdaccio`.

## Podstawowa konfiguracja

Domyślna konfiguracja obsługuje pakiety **o zakresie** i umożliwia każdemu użytkownikowi dostęp do wszystkich pakietów, ale tylko **uwierzytelnionych użytkowników do publikowania**.

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

## Sekcje

Poniższe sekcje wyjaśniają, co oznacza każda właściwość i różne opcje.

### Magazyn danych

Jest lokalizacją domyślnego magazynu danych. **Verdaccio domyślnie jest oparte o lokalny system plików**.

```yaml
storage: ./storage
```

### Wtyczki

Jest lokalizacja katalogu wtyczek. Przydatny w przypadku wdrożeń opartych na Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Uwierzytelnianie

Uwierzytelnianie jest wykonywane tutaj, podstawowe uwierzytelnianie jest oparte o `htpasswd` i jest wbudowane w aplikację. Możesz modyfikować jego zachowanie poprzez [wtyczki](plugins.md). Więcej informacji o tej sekcji znajdziesz na [stronie dotyczącej uwierzytelniania](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Internetowy interfejs użytkownika

Ta właściwość pozwala Ci zmienić wygląd internetowego interfejsu użytkownika.. Więcej informacji na temat tej sekcji można znaleźć na stronie [internetowego interfejsu użytkownika](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Uplinks

Uplinks to zdolność systemu do pobierania pakietów ze zdalnych rejestrów, gdy pakiety te nie są dostępne lokalnie. Więcej informacji na temat tej sekcji można znaleźć na [stronie uplinks](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Packages

Pakiety pozwalają użytkownikowi kontrolować, w jaki sposób pakiety będą dostępne. Więcej informacji na temat tej sekcji można znaleźć na [stronie pakietów](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Ustawienia zaawansowane

### Publikowanie w trybie offline

Domyślnie `verdaccio` nie pozwala na publikowanie w trybie offline, można to zmienić poprzez ustawienie tej właściwości na *true*.

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

### Max Body Size

Domyślnie maksymalny rozmiar ciała dokumentu JSON to `10mb`, jeśli napotykasz błędy takie jak `"zbyt duży rozmiar żądania"` możesz zwiększyć tę wartość.

```yaml
max_body_size: 10mb
```

### Port nasłuchu

`verdaccio` domyślnie nadaje poprzez port `4873`. Zmiana tego portu może być dokonana przez [cli](cli.md) lub przez plik konfiguracyjny, wszystkie następujące opcje są prawidłowe.

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

Aby aktywować `https` w `verdaccio` wystarczy ustawić flagę `listen` na protokół *https://*. Więcej informacji o tej sekcji znajdziesz na [stronie dotyczącej ssl](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxy to specjalne serwery HTTP stworzone do transferu danych z serwerów zdalnych do klientów lokalnych.

#### http_proxy and https_proxy

Jeśli posiadasz serwer proxy w swojej sieci możesz ustawić nagłówek `X-Forwarded-For` używając następujących właściwości.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Ta zmienna powinna posiadać listę domen oddzieloną przecinkami, dla których proxy nie powinno być używane.

```yaml
no_proxy: localhost,127.0.0.1
```

### Powiadomienia

Dostarczanie powiadomień do aplikacji zewnętrznych jest całkiem łatwe poprzez web hooks. Aby uzyskać więcej informacji o tej sekcji przeczytaj [stronę dotyczącą powiadomień](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Bardziej szczegółowe ustawienia konfiguracji znajdziesz w [kodzie źródłowym](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` to nowa komenda wydana razem z [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio zawiera wbudowany plugin oprogramowania pośredniego do obsługi tej komendy.

> Jeśli instalujesz aplikację od nowa, to posiada ona ustawienia domyślnie, w przeciwnym razie musisz dodać następujące właściwości do Twojego pliku konfiguracyjnego

```yaml
middlewares:
  audit:
    enabled: true
```