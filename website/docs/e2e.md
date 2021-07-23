---
id: e2e
title: "End to End testing"
---

Some projects organize packages in multi-packages repositories or [monorepos](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). E2E testing is a topic that usually is only relevant for User Interfaces, but from a Node.js perspective, **publishing packages also need to be tested**.

```mdx-code-block
import { Tweet } from 'react-twitter-widgets'

<Tweet tweetId="951427674844680192" options={{
  dnt: true,
  align: 'center'
}} />
```

Such approach has been really hard to achieve considering:

* Populate canary packages on public services seems not to be a good idea
* Some self-hosted OSS registries are too heavy
* Offline environments (private networks)

**Verdaccio** is a lightweight registry with zero-configuration that **fits perfectly in any E2E + CI workflow**.

## Implementation {#implementation}

There is no a silver bullet yet, each implementation seems to be specific for each project, you can check some of them in
the following thread [clicking here](https://stackoverflow.com/a/50222427/308341).

### Example using Bash {#example-using-bash}

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


## Who is using it for E2E? {#who-is-using-it-for-e2e}

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






