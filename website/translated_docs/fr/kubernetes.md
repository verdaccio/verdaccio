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

### Deploy a specific version

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### Upgrading Verdaccio

```bash
helm upgrade npm stable/verdaccio
```

### Uninstalling

```bash
helm del --purge npm
```

**Note:** this command delete all the resources, including packages that you may have previously published to the registry.

### Custom Verdaccio configuration

You can customize the Verdaccio configuration using a Kubernetes *configMap*.

#### Prepare

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml) and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
```

**Note:** Make sure you are using the right path for the storage that is used for persistency:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Deploy the configMap

Deploy the `configMap` to the cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Deploy Verdaccio

Now you can deploy the Verdaccio Helm chart and specify which configuration to use:

```bash
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Rancher Support

[Rancher](http://rancher.com/) est une plate-forme complète de gestion de conteneurs facilitant la gestion et l'utilisation des conteneurs en production.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)