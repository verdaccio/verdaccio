---
id: puppet
title: "Puppet"
---
Instalar verdaccio para Debian, Ubuntu, Fedora y RedHat.

# Uso

Hay dos variantes para instalar verdaccio utilizando este módulo Puppet:

* Modo Aplicación (con aplicación de Puppet y sin necesidad de configurar el puppetmaster)
* Modo Agente Maestro (con acceso del agente Puppet a su configuración a través del puppetmaster).

En ambas variantes tiene que llamar explícitamente a "class nodejs {}" en su script de puppet porque el módulo de puppet-verdaccio solo define esto como un requisito, por lo que tiene toda la flexibilidad que quiera cuando instale nodejs. Desplácese hacia abajo para detalles sobre la variante del Modo Agente Maestro.

Para más información:

<https://github.com/verdaccio/puppet-verdaccio>

> Estamos buscando colaboradores para esta integración, si está interesado [ refiérase a esta entrada](https://github.com/verdaccio/puppet-verdaccio/issues/11).