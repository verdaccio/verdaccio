---
id: e2e
title: "Teste End-to-End"
---

Alguns projetos organizam pacotes em repositórios multi-pacotes ou [mono repositórios](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). O teste E2E é um tópico que geralmente só é relevante para as Interfaces de usuário, porém do ponto de vista do Node.js, **a publicação de pacotes também requerem testes**.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Solution: a local npm registry. <a href="https://t.co/kvcyVANVSK">https://t.co/kvcyVANVSK</a></p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/951427674844680192?ref_src=twsrc%5Etfw">11 de Janeiro de 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Tal abordagem tem sido realmente difícil de alcançar, considerando:

* Preencher pacotes canários em serviços públicos parece não ser uma boa ideia
* Alguns registros de OSS auto-hospedados são muito pesados
* Ambientes offline (redes privadas)

Ainda não há uma solução única, cada implementação parece ser específica de cada projeto, você pode verificar algumas delas [clicando neste tópico](https://stackoverflow.com/a/50222427/308341).

## Implementação

Ainda não há uma solução única, cada implementação parece ser específica de cada projeto, você pode verificar algumas delas [clicando neste tópico](https://stackoverflow.com/a/50222427/308341).

### Exemplos usando Bash

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






