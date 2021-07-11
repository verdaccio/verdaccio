---
id: puppet
title: "Puppet"
---

Instalar verdaccio para Debian, Ubuntu, Fedora e RedHat.

# Utilização

Existem duas variantes para instalar o verdaccio usando este módulo Puppet:

* Método Apply (com puppet-apply e sem a necessidade de configurar o puppetmaster)
* Método Master-Agent (com o puppet-agent acessando sua configuração através do puppetmaster).

Em ambas as variantes você tem que chamar explicitamente a "classe nodejs {}" no seu script de puppet porque o módulo puppet-verdaccio só o define como um requisito, de forma que você tenha toda a flexibilidade desejada ao instalar o nodejs. Role para baixo para detalhes sobre a variante do método Master-Agent.

Para mais informações:

[https://github.com/verdaccio/puppet-verdaccio](https://github.com/verdaccio/puppet-verdaccio)

> Estamos à procura de colaboradores ativos para esta integração, se você estiver interessado [consulte este ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).




