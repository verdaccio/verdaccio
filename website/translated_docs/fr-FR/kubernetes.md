---
id: kubernetes
title: "Kubernetes"
---
Les instructions pour développer Verdaccio sur un cluster Kubernetes sont disponibles dans l’archive [verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example). Cependant, la méthode recommandée pour installer Verdaccio sur un cluster Kubernetes consiste à utiliser [Helm](https://helm.sh). Helm est un [Kubernetes](https://kubernetes.io) gestionnaire de paquets, qui présente de nombreux avantages.

## Helm

### Configurer Helm

Si vous n'avez jamais utilisé Helm, vous devez configurer le contrôleur Helm dit Tiller:

```bash
helm init
```

### Installer

Développez la charte de Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio). Dans cet exemple, nous utilisons `npm` comme nom de version:

```bash
helm install --name npm stable/verdaccio
```

### Déployer une version spécifique

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### En cours de mettre Verdaccio à niveau

```bash
helm upgrade npm stable/verdaccio
```

### Désinstallation

```bash
helm del --purge npm
```

**Remarque:** cette commande supprime toutes les ressources, y compris les packages que vous avez peut-être déjà publiés dans le registre.

### Configuration personnalisée de Verdaccio

Vous pouvez personnaliser la configuration de Verdaccio en utilisant un Kubernetes *configMap*.

#### Préparer

Copiez la [configuration existante](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml) et adaptez la à votre propre cas d'utilisation:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
```

**Remarque:** assurez-vous que vous utilisez le chemin correct d'archivage utilisé pour la persistance:

```yaml
torage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Développer le configMap

Développer le `configMap` dans le cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Développer Verdaccio

Maintenant, vous pouvez développer le tableau Verdaccio Helm et spécifier la configuration à utiliser:

```bash
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Support Rancher

[Rancher](http://rancher.com/) est une plate-forme complète de gestion de conteneurs facilitant la gestion et l'utilisation des conteneurs en production.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)