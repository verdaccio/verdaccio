---
id: linking-remote-registry
title: "Связь с удалённым репозиторием"
---

Verdaccio - это прокси, и по умолчанию у него есть [аплинк](uplinks.md) с публичным репозиторием.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

У вас могут быть аплинки на несколько репозиториев, и в этом документе вы найдете несколько полезных конфигураций.

## Используем scope

Единственный способ для доступа к нескольким репозиториям, использующийся в `.npmrc`, это разделение по scope, например:

```
// .npmrc
registry=https://registry.npmjs.org
@mycompany:registry=http://localhost:4873
```

Этот способ вполне годный, но есть несколько минусов:

* Работает **только для scope**
* Учитывается только полное совпадение имени scope, **никаких регулярных выражений**
* Один scope **не может иметь связь с несколькими репозиториями**
* Токены/пароли **должны быть опеределны в ** `.npmrc`.

Полный пример смотрите [здесь](https://stackoverflow.com/questions/54543979/npmrc-multiple-registries-for-the-same-scope/54550940#54550940).

## Связь с репозиторием

Добавить связь с новым репозиторием очень просто. Во-первых, добавьте новый блок в секции `uplinks`. Помните, порядок имеет значение.

```yaml
  uplinks:
    private:
      url: https://private.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: private

```

Во-вторых, добавьте строчку `proxy`, чтобы определить, какой репозиторий вы хотите использовать.

## Связь с несколькими репозиториями

```yaml
  uplinks:
    server1:
      url: https://server1.registry.net/npm
    server2:
      url: https://server2.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: server1 server2
```

В Verdaccio можно указать несколько репозиториев в поле `proxy`. Первым отправится запрос в первый репозиторий; если он будет недачным, будет отправлен запрос во второй, и так далее.

## Оффлайновый репозиторий

Можно сделать репозиторий полностью оффлайновым. Если вы не хотите никаких соединений с удаленными репозиториями, можно сделать так.

```yaml

auth:
  htpasswd:
    file: ./htpasswd
uplinks:
packages:
  '@my-company/*':
    access: $all
    publish: none
  '@*/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
```

Удалите все строчки с полем `proxy` в каждом блоке секции `packages`. Реестр станет полностью оффлайновым.
