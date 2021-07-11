---
id: e2e
title: "End to End тестирование"
---

Некоторые проекты организуют свой код, разделяя его на много пакетов, другие используют [монорепо](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). E2E-тестирование используется обычно только для тестировани пользовательских интерфейсов, но, с точки зрения Node.js, **публикацию пакетов тоже нужно тестировать**.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Solution: a local npm registry. <a href="https://t.co/kvcyVANVSK">https://t.co/kvcyVANVSK</a></p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/951427674844680192?ref_src=twsrc%5Etfw">11 января 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Используя этот подход, вы можете столкнуться со следующими трудностями:

* Публиковать "версии разработчиков" пакетов на публичных сервисах не кажется хорошей идеей
* Некоторые локальные OSS репозитории - "тяжелые"
* Оффлайн-окружение (в приватных сетях)

"Серебрянной пули" нет, и, похоже, реализация для каждого проекта - особенная; вы можете посмотреть на примеры в [этом обсуждении](https://stackoverflow.com/a/50222427/308341).

## Реализация

"Серебрянной пули" нет, и, похоже, реализация для каждого проекта - особенная; вы можете посмотреть на примеры в [этом обсуждении](https://stackoverflow.com/a/50222427/308341).

### Примеры, использующие Bash

This is the most simple example using Verdaccio in a bash script (extracted from *create-react-app*).

```bash
#!/bin/sh

set -e

local_registry="http://0.0.0.0:4873"

# start local registry
tmp_registry_log=`mktemp`
sh -c "mkdir -p $HOME/.config/verdaccio"
sh -c "cp --verbose /config.yaml $HOME/.config/verdaccio/config.yaml"
sh -c "nohup verdaccio --config $HOME/.config/verdaccio/config.yaml &>$tmp_registry_log &"
# wait for `verdaccio` to boot
grep -q 'http address' <(tail -f $tmp_registry_log)
# login so we can publish packages
sh -c "npm-auth-to-token -u test -p test -e test@test.com -r $local_registry"
# Run nmp command
sh -c "npm --registry $local_registry publish"
```


## Who is using it for E2E?

* [create-react-app](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md#contributing-to-e2e-end-to-end-tests) *(+73.5k ⭐️)*
* [Storybook](https://github.com/storybooks/storybook) *(+44k ⭐️)*
* [Gatsby](https://github.com/gatsbyjs/gatsby) *(+40k ⭐️)
* [Babel.js](https://github.com/babel/babel) *(+35k ⭐️)*
* [Uppy](https://github.com/transloadit/uppy) *(+21k ⭐️)*
* [Aurelia Framework](https://github.com/aurelia) *(+12k ⭐️)*
* [ethereum/web3.js](https://github.com/ethereum/web3.js) *(+8k ⭐️)*
* [bit](https://github.com/teambit/bit) *(+6k ⭐️)*
* [pnpm](https://github.com/pnpm/pnpm) *(+6k ⭐️)*
* [Mozilla Neutrino](https://github.com/neutrinojs/neutrino) *(+3k ⭐️)*
* [Embark](https://embark.status.im/) *(+3k ⭐️)*
* [Hyperledger Composer](https://github.com/hyperledger/composer) *(+1.6k ⭐️)*
* [Wix Yoshi](https://github.com/wix/yoshi)






