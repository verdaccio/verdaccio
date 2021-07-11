---
id: puppet
title: "Puppet"
---

Установите verdaccio на Debian, Ubuntu, Fedora, and RedHat.

# Использование

Есть два варианта установки verdaccio с помощью Puppet:

* Apply-mode (с помощью puppet-apply, установка puppetmaster не требется)
* Master-Agent-mode (с помощью puppet-agent с доступом к вашей конфигурации через puppetmaster).

В обоих вариантах вам надо сделать вызов "class nodejs {}" в вашем puppet-скрипте, потому что модуль puppet-verdaccio только выставляет требование на модуль nodejs, так что у вас появляется гибкость в выборе способа установки nodejs. Чтобы получить больше информации для варианта с Master-Agent-mode, прокрутите вниз.

Для получения дальнейшей информации:

[https://github.com/verdaccio/puppet-verdaccio](https://github.com/verdaccio/puppet-verdaccio)

> Мы ищем активных контрибьюторов для этого раздела, если вы заинтересовались, [посмотрите этот тикет](https://github.com/verdaccio/puppet-verdaccio/issues/11).




