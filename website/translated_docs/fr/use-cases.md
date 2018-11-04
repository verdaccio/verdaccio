---
id: use-cases
title: "Cas d’utilisation"
---
## Utilisation de packages privés

Vous pouvez ajouter des utilisateurs et gérer quels utilisateurs peuvent accéder à quels packages.

Il est conseillé de définir un préfixe pour les paquets privés, par exemple "local", afin que tous les éléments privés aient cet aspect: `local-foo`. De cette façon, vous pouvez clairement séparer les paquets publics et privés.

## Utilisation des paquets publics à partir de npmjs.org

Si un paquet n'existe pas dans l'archive, le serveur essaiera de le récupérer à partir de npmjs.org. Si npmjs.org ne fonctionne pas, il ne fournira les paquets mis en cache que s'il n'y avait pas d'autres paquets. Verdaccio ne téléchargera que ce qui est requis (= requis par les clients), et ces informations seront mises en cache. Ainsi, si le client demande la même chose une seconde fois, il peut être servi sans avoir à demander à npmjs.org.

Exemple: si vous effectuez avec succès une requête express@3.0.1 une fois sur ce serveur, vous pouvez le faire à nouveau (avec toutes ses dépendances) à tout moment, même si npmjs.org ne fonctionne pas. Mais disons qu'express@3.0.0 ne sera pas téléchargé avant que ce soit réellement nécessaire pour quelqu'un. Et si npmjs.org était hors ligne, ce serveur indiquerait que seule la valeur express@3.0.1 (= uniquement ce qui est dans le cache) sera publiée, mais rien d'autre.

## Annuler les paquets publiques

Si vous souhaitez utiliser une version modifiée d'un paquet public`foo`, vous ne pouvez le publier que sur votre serveur local. Par conséquent, si vous écrivez `npm install foo`, cette version sera installée.

Il y a deux options ici:

1. You want to create a separate fork and stop synchronizing with public version.
    
    If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.
    
    When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.
    
    In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.