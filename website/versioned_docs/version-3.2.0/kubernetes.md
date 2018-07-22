---
id: version-3.2.0-kubernetes
title: Kubernetes
original_id: kubernetes
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the
[verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example)
repository. However, the recommended method to install Verdaccio on a Kubernetes
cluster is to use [Helm](https://helm.sh). Helm is a
[Kubernetes](https://kubernetes.io) package manager which bring multiple
advantages.

## Helm

### Setup Helm

If you haven't used Helm before, you need to setup the Helm controller called
Tiller:

```bash
helm init
```

### Install

Deploy the Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio)
chart. In this example we use `npm` as release name:

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

**Note:** this command delete all the resources, including packages that you may
have previously published to the registry.


### Custom Verdaccio configuration

You can customize the Verdaccio configuration using a Kubernetes *configMap*.

#### Prepare

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml)
and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
```

**Note:** Make sure you are using the right path for the storage that is used for
persistency:

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

Now you can deploy the Verdaccio Helm chart and specify which configuration to
use:

```bash
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Rancher Support

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
