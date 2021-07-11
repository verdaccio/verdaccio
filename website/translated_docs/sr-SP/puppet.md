---
id: puppet
title: "Puppet"
---

Инсталација verdaccio-а за Debian, Ubuntu, Fedora, и RedHat.

# Коришћење

Постоје два начина за инсталирање verdaccio-а коришћењем Puppet модула:

* Apply-mode (са puppet-apply и без да је puppetmaster setup неопходан)
* Master-Agent-mode (са puppet-agent приступа Вашој конфигурацији преко puppetmaster).

У оба случаја морате експлицитно позвати "class nodejs {}" у свом puppet script јер puppet-verdaccio module једино то дефинише као неопходно, тако да можете бити флексибилни када инсталирате nodejs. Скролујте на доле за више детаља о Master-Agent-mode варијанти.

За даље информације:

[https://github.com/verdaccio/puppet-verdaccio](https://github.com/verdaccio/puppet-verdaccio)

> Тражимо активне сараднике за ову интеграцију, па ако сте заинтересовани, [пошаљите нам ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).




