---
id: protect-your-dependencies
title: "Protecting packages"
---

`verdaccio` allows you protect publish, to achieve that you will need to set up correctly your [packages access](packages).

<div id="codefund">''</div>

### Конфигурисање пакета

Погледајмо наведена подешавања као пример. Потребно је да подесите dependencies које имају префикс у виду `my-company-*` и треба да их заштитите од анонимних или других пријављених корисника који су без одговарајућих овлашћења (credentials).

```yaml
  'my-company-*':
    access: admin teamA teamB teamC
    publish: admin teamA
    proxy: npmjs
```

Са наведеном конфигурацијом дозвољавамо групама **admin** и **teamA** да *публикују*, а групама **teamA** **teamB** и **teamC** *приступ* до тих dependencies.

### Пример из праксе: teamD покушава да приступи некој dependency

Даље, пријављен сам као **teamD**. Не би требало да будем у могућности да приступим свим dependencies-има које садрже `my-company-*` патерн.

```bash
➜ npm whoami
teamD
```

**Нећу имати приступ до свих dependencies-а и такође нећу бити видљив преко веба за корисника **teamD**. Ако покушам да приступим, догодиће се следеће.</p> 

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! 403 Forbidden: webpack-1@latest
```

или са `yarn`

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 
error An unexpected error occurred: "http://localhost:5555/webpack-1: unregistered users are not allowed to access package my-company-core".
```