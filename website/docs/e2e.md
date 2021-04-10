---
id: e2e
title: 'End to End testing'
---

Some projects organize packages in multi-packages repositories or [monorepos](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). E2E testing is a topic that usually is only relevant for User Interfaces, but from a Node.js perspective, **publishing packages also need to be tested**.

<div id="codefund">''</div>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Solution: a local npm registry. <a href="https://t.co/kvcyVANVSK">https://t.co/kvcyVANVSK</a></p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/951427674844680192?ref_src=twsrc%5Etfw">11 de enero de 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Such approach has been really hard to achieve considering:

- Populate canary packages on public services seems not to be a good idea
- Some self-hosted OSS registries are too heavy
- Offline environments (private networks)

**Verdaccio** is a lightweight registry with zero-configuration that **fits perfectly in any E2E + CI workflow**.

## Implementation

There is no a silver bullet yet, each implementation seems to be specific for each project, you can check some of them in
the following thread [clicking here](https://stackoverflow.com/a/50222427/308341).

### Example using Bash

This is the most simple example using Verdaccio in a bash script (extracted from _create-react-app_).

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

- [create-react-app](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md#contributing-to-e2e-end-to-end-tests) _(+73.5k ⭐️)_
- [Storybook](https://github.com/storybooks/storybook) _(+44k ⭐️)_
- [Gatsby](https://github.com/gatsbyjs/gatsby) \*(+40k ⭐️)
- [Babel.js](https://github.com/babel/babel) _(+35k ⭐️)_
- [Uppy](https://github.com/transloadit/uppy) _(+21k ⭐️)_
- [Aurelia Framework](https://github.com/aurelia) _(+12k ⭐️)_
- [ethereum/web3.js](https://github.com/ethereum/web3.js) _(+8k ⭐️)_
- [bit](https://github.com/teambit/bit) _(+6k ⭐️)_
- [pnpm](https://github.com/pnpm/pnpm) _(+6k ⭐️)_
- [Mozilla Neutrino](https://github.com/neutrinojs/neutrino) _(+3k ⭐️)_
- [Embark](https://embark.status.im/) _(+3k ⭐️)_
- [Hyperledger Composer](https://github.com/hyperledger/composer) _(+1.6k ⭐️)_
- [Wix Yoshi](https://github.com/wix/yoshi)
