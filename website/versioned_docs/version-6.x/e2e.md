---
id: e2e
title: 'End to End testing'
---

### Testing the integrity of React components by publishing in a private registry

> The final stage of a react component is when it is being published and distributed. How can I ensure my packages won’t crash in production? This talk will help you to test your React components by publishing them to a private registry and running End-to-End tests against them.

<iframe width="300" height="600" src="https://www.youtube.com/embed/bRKZbrlQqLY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- [Slides](https://docs.google.com/presentation/d/1a2xkqj1KlUayR1Bva1bVYvavwOPVuLplxFtup9MI_U4/edit?usp=sharing)
- [Demo](https://github.com/juanpicado/verdaccio-end-to-end-tests)

## End to End and Verdaccio

Some projects organize packages in multi-packages repositories or [monorepos](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). End to End testing is a topic that usually is only relevant for User Interfaces, but from a Node.js perspective, **publishing packages also need to be tested**.

Such approach has been really hard to achieve considering:

- Populate canary packages on public services seems not to be a good idea
- Some self-hosted OSS registries are too heavy
- Offline environments (private networks)

**Verdaccio** is a lightweight registry with zero-configuration that **fits perfectly in any E2E + CI workflow**.

## Implementation {#implementation}

There is no a silver bullet yet, each implementation seems to be specific for each project, you can check some of them in
the following thread [clicking here](https://stackoverflow.com/a/50222427/308341).

## Examples in Open Source

The following projects have examples using Verdaccio in Open Source

### Bash Examples

- [Bun ![Stars](https://img.shields.io/github/stars/oven-sh/bun?label=⭐️)](https://github.com/oven-sh/bun/commits/main/test/cli/install/registry/verdaccio.yaml)
- [Babel.js ![Stars](https://img.shields.io/github/stars/babel/babel?label=⭐️)](https://github.com/babel/babel)
- [Docusaurus ![Stars](https://img.shields.io/github/stars/facebook/docusaurus?label=⭐️)](https://github.com/facebook/docusaurus)
- [create-react-app ![Stars](https://img.shields.io/github/stars/facebook/create-react-app?label=⭐️)](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md#contributing-to-e2e-end-to-end-tests)
- [pnpm ![Stars](https://img.shields.io/github/stars/pnpm/pnpm?label=⭐️)](https://github.com/pnpm/pnpm)
- [Uppy ![Stars](https://img.shields.io/github/stars/transloadit/uppy?label=⭐️)](https://github.com/transloadit/uppy)
- [ethereum/web3.js ![Stars](https://img.shields.io/github/stars/ethereum/web3.js?label=⭐️)](https://github.com/ethereum/web3.js)
- [adobe react-spectrum ![Stars](https://img.shields.io/github/stars/adobe/react-spectrum?label=⭐️)](https://github.com/adobe/react-spectrum/pull/2432)
- [Mozilla Neutrino ![Stars](https://img.shields.io/github/stars/neutrinojs/neutrino?label=⭐️)](https://github.com/neutrinojs/neutrino)

This is the simplest example using Verdaccio in a bash script (extracted from _create-react-app_).

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

### Docker Examples

- [Hyperledger](https://github.com/hyperledger/fabric-chaincode-node)

### Programmatic Examples

- [Storybook ![Stars](https://img.shields.io/github/stars/storybooks/storybook?label=⭐️)](https://github.com/storybooks/storybook)
- [Gatsby ![Stars](https://img.shields.io/github/stars/gatsbyjs/gatsby?label=⭐️)](https://github.com/gatsbyjs/gatsby)

#### Verdaccio module

Via CLI:

- [Aurelia Framework ![Stars](https://img.shields.io/github/stars/aurelia/framework?label=⭐️)](https://github.com/aurelia)
- [Netlify CLI ![Stars](https://img.shields.io/github/stars/netlify/cli?label=⭐️)](https://github.com/netlify/cli)
- [Embark ![Stars](https://img.shields.io/github/stars/embarklabs/embark?label=⭐️)](https://embark.status.im/)
- [Microsoft Beachball ![Stars](https://img.shields.io/github/stars/microsoft/beachball?label=⭐️)](https://github.com/microsoft/beachball)

#### Node.js `child_process` examples

- [Angular CLI ![Stars](https://img.shields.io/github/stars/angular/angular-cli?label=⭐️)](https://github.com/angular/angular-cli)
- [bit ![Stars](https://img.shields.io/github/stars/teambit/bit?label=⭐️)](https://github.com/teambit/bit)
- [pnpm ![Stars](https://img.shields.io/github/stars/pnpm/pnpm?label=⭐️)](https://github.com/pnpm/pnpm)
- [aws-sdk cli v3 ![Stars](https://img.shields.io/github/stars/aws/aws-sdk-js-v3?label=⭐️)](https://github.com/aws/aws-sdk-js-v3)
- [angular-eslint ![Stars](https://img.shields.io/github/stars/angular-eslint/angular-eslint?label=⭐️)](https://github.com/angular-eslint/angular-eslint)

## Example repositories

- [e2e-ci-example-gh-actions](https://github.com/juanpicado/e2e-ci-example-gh-actions)
- [verdaccio-end-to-end-tests](https://github.com/juanpicado/verdaccio-end-to-end-tests)
- [verdaccio-fork](https://github.com/juanpicado/verdaccio-fork)
- [simplified e2e testing using verdaccio](https://github.com/rluvaton/e2e-verdaccio-example)
