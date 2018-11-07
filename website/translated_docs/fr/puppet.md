---
id: puppet
title: "Puppet"
---
Installez verdaccio pour Debian, Ubuntu, Fedora, et RedHat.

# Utilisation

Deux variantes sont disponibles pour installer verdaccio à l’aide de ce module Puppet:

* Mode d'application (avec puppet-apply et aucune configuration puppetmaster n'est demandée)
* Mode Master-Agent (avec accès à la configuration de puppet-agent via puppetmaster).

Dans les deux variantes, il est nécessaire d'appeler explicitement la "classe nodejs {}" dans le script puppet car le module puppet-verdaccio le définit uniquement en tant qu'exigence. Vous disposez ainsi de toute la flexibilité que vous souhaitez pour l'installation de nodejs. Faites défiler la liste pour plus de détails sur la variante de la méthode Master-Agent.

Pour plus d'informations:

<https://github.com/verdaccio/puppet-verdaccio>

> Nous sommes à la recherche de collaborateurs actifs pour cette intégration. Si vous êtes intéressé, [reportez-vous à ce ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).