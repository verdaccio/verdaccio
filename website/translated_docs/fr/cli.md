---
id: cli
title: "Outil de ligne de commande"
---
La CLI de Verdaccio est votre moyen de lancer l'application.

## Commandes

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Commande           | Par défaut                     | Exemple        | Description                 |
| ------------------ | ------------------------------ | -------------- | --------------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | port http                   |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | le fichier de configuration |

## Emplacement du fichier de configuration par défaut

Pour localiser le répertoire de base, nous nous appuyons sur **$XDG_DATA_HOME** comme premier choix et sur l'environnement Windows que nous cherchons [Variable d’environnement APPDATA ](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Emplacement de stockage par défaut

On utilise **$XDG_DATA_HOME**la variable d'environnement par défaut pour trouver le stockage par défaut qui [ devrait être identique ](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) de $HOME/ .local / share. Si vous utilisez un stockage personnalisé, cet emplacement est sans importance.