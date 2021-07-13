---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. Cependant, la méthode recommandée pour installer Verdaccio sur un cluster Kubernetes consiste à utiliser [Helm](https://helm.sh). Helm est un [Kubernetes](https://kubernetes.io) gestionnaire de paquets, qui présente de nombreux avantages.

## Helm

### Configurer Helm

Si vous n'avez jamais utilisé Helm, vous devez configurer le contrôleur Helm dit Tiller:

```bash
helm init
```

### Installer

> ⚠️ If you are using this helm chart, please [be aware of the migration of the repository](https://github.com/verdaccio/verdaccio/issues/1767).

Deploy the Helm [verdaccio/verdaccio](https://github.com/verdaccio/charts) chart.

### Add repository

```
helm repo add verdaccio https://charts.verdaccio.org
```

In this example we use `npm` as release name:

```bash
helm install npm verdaccio/verdaccio
```

### Déployer une version spécifique

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### En cours de mettre Verdaccio à niveau

```bash
helm upgrade npm verdaccio/verdaccio
```

### Désinstallation

```bash
helm uninstall npm
```

**Remarque:** cette commande supprime toutes les ressources, y compris les packages que vous avez peut-être déjà publiés dans le registre.


### Configuration personnalisée de Verdaccio

Vous pouvez personnaliser la configuration de Verdaccio en utilisant un Kubernetes *configMap*.

#### Préparer

Copier la [configuration existante](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) et l'adapter à votre cas d'utilisation :

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
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
helm install npm --set customConfigMap=verdaccio-config verdaccio/verdaccio
```

#### NGINX proxy body-size limit

The standard k8s NGINX ingress proxy allows for 1MB for body-size which can be increased by modifying the default deployment options according to the [documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-max-body-size):
```yaml
...

annotations:
...

    kubernetes.io/proxy-body-size: 20m
....

```

## Support Rancher

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
