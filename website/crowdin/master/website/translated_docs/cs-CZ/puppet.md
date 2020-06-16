---
id: puppet
title: "Puppet"
---

Instalace Verdaccia na Debian, Ubuntu, Fedoru a RedHat.

# Použití

Existují dvě varianty instalace verdaccia pomocí Puppet modulu:

* Apply-mode (with puppet-apply and no puppetmaster setup needed)
* Master-Agent-mode (with puppet-agent accessing your configuration through the puppetmaster).

In both variants you have to explicitely call "class nodejs {}" in your puppet script because the puppet-verdaccio module only defines this as a requirement, so you have all the flexibility you want when installing nodejs. Scroll down for details about Master-Agent-mode variant.

Další informace:

<https://github.com/verdaccio/puppet-verdaccio>

> We are looking for active contributors for this integration, if you are interested [refers to this ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).