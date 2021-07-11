---
id: e2e
title: "Idanwo Opin si Opin"
---

Awọn iṣẹ akanṣe kan ma n ṣeto awọn akojọ ni awọn ibi ipamọ ti ọlọpọlọpọ-akojọ tabi [onibi ipamọ kan](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). E2E testing is a topic that usually is only relevant for User Interfaces, but from a Node.js perspective, **publishing packages also need to be tested**.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Ọna abayọ: ibi iforukọsilẹ npm ibilẹ kan. <a href="https://t.co/kvcyVANVSK">https://t.co/kvcyVANVSK</a></p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/951427674844680192?ref_src=twsrc%5Etfw">osu kini ọjọ kọkanla ọdun 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Iru ọna yẹn ti jẹ eyi to soro gidi gan lati ni aṣeyọri pẹlu riro iwọnyi:

* Iselọpọ awọn akojọ canary lori awọn iṣẹ gbogbogbo ni o dabi pe o ko kin se imọran to dara
* Awọn ibi iforukọsilẹ OSS agbalejo-alara ẹni kan ti wuwo ju
* Awọn awujọ alaisilorila (awọn nẹtiwọki aladani)

Ko ti si ọta fadaka kankan, imuṣiṣẹ kọọkan dabi pe o jẹ pato fun iṣẹ akanṣe kọọkan, o le ṣayẹwo diẹ ninu wọn ni okun atẹle yii [tẹ ibi](https://stackoverflow.com/a/50222427/308341).

## Imuṣiṣẹ

Ko ti si ọta fadaka kankan, imuṣiṣẹ kọọkan dabi pe o jẹ pato fun iṣẹ akanṣe kọọkan, o le ṣayẹwo diẹ ninu wọn ni okun atẹle yii [tẹ ibi](https://stackoverflow.com/a/50222427/308341).

### Apẹẹrẹ nipa lilo Bash

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






