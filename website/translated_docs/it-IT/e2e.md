---
id: e2e
title: "End to End testing"
---

Alcuni progetti organizzano pacchetti in repository multi pacchetti o [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). Il test E2E è un argomento che è rilevante solitamente solo per le Interfacce Utente, tuttavia secondo Node.js, **è necessario testare anche i pacchetti in pubblicazione**.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Solution: a local npm registry. <a href="https://t.co/kvcyVANVSK">https://t.co/kvcyVANVSK</a></p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/951427674844680192?ref_src=twsrc%5Etfw">11 gennaio 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Tale approccio è stato molto difficile da raggiungere considerando che:

* Compilare pacchetti canary sui servizi pubblici sembra non essere una buona idea
* Alcuni registri OSS self-hosted sono troppo pesanti
* Ambienti offline (reti private)

Non è ancora disponibile la soluzione perfetta, ogni implementazione sembra essere specifica per ciascun progetto; è possibile consultarne alcune nel thread seguente [cliccando qui](https://stackoverflow.com/a/50222427/308341).

## Implementazione

Non è ancora disponibile la soluzione perfetta, ogni implementazione sembra essere specifica per ciascun progetto; è possibile consultarne alcune nel thread seguente [cliccando qui](https://stackoverflow.com/a/50222427/308341).

### Esempio di utilizzo di Bash

This is the most simple example using Verdaccio in a bash script (extracted from *create-react-app*).

```bash
#!/bin/sh

set -e

local_registry="http://0.0.0.0:4873"

# avvia il registro locale
tmp_registry_log=`mktemp`
sh -c "mkdir -p $HOME/.config/verdaccio"
sh -c "cp --verbose /config.yaml $HOME/.config/verdaccio/config.yaml"
sh -c "nohup verdaccio --config $HOME/.config/verdaccio/config.yaml &>$tmp_registry_log &"
# attendi che`verdaccio` esegua il boot
grep -q 'http address' <(tail -f $tmp_registry_log)
# fai il login affinché noi possiamo pubblicare i pacchetti 
sh -c "npm-auth-to-token -u test -p test -e test@test.com -r $local_registry"
# Esegui il comando nmp 
sh -c "npm --registry $local_registry publish"
```


## Chi lo sta usando per E2E?

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






