---
id: puppet
title: "Marioneta"
---
Instalar verdaccio para Debian, Ubuntu, Fedora y RedHat.

# Uso

Hay dos variantes para instalar verdaccio utilizando este módulo de Marioneta:

* Modo Aplicación (con aplicación de marioneta y sin necesidad de configuración del titiritero)
* Modo Agente Maestro (con acceso del agente de marioneta a su configuración a través del titiritero).

In both variants you have to explicitely call "class nodejs {}" in your puppet script because the puppet-verdaccio module only defines this as a requirement, so you have all the flexibility you want when installing nodejs. Scroll down for details about Master-Agent-mode variant.

For further information:

<https://github.com/verdaccio/puppet-verdaccio>

> We are looking for active contributors for this integration, if you are interested [refers to this ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).