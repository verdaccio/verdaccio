---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the
[verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example)
repository. However, the recommended method to install Verdaccio on a Kubernetes
cluster is to use [Helm](https://helm.sh). Helm is a
[Kubernetes](https://kubernetes.io) package manager which bring multiple
advantages.

## Helm {#helm}

### Setup Helm {#setup-helm}

If you haven't used Helm before, you need to setup the Helm controller called
Tiller:

```bash
helm init
```

### Install {#install}

> ⚠️ If you are using this helm chart, please [be aware of the migration of the repository](https://github.com/verdaccio/verdaccio/issues/1767).

Deploy the Helm [verdaccio/verdaccio](https://github.com/verdaccio/charts)
chart.

### Add repository {#add-repository}

```
helm repo add verdaccio https://charts.verdaccio.org
```

In this example we use `npm` as release name:

```bash
helm install npm verdaccio/verdaccio
```

### Deploy a specific version {#deploy-a-specific-version}

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Upgrading Verdaccio {#upgrading-verdaccio}

```bash
helm upgrade npm verdaccio/verdaccio
```

### Uninstalling {#uninstalling}

```bash
helm uninstall npm
```

**Note:** this command delete all the resources, including packages that you may
have previously published to the registry.


### Custom Verdaccio configuration {#custom-verdaccio-configuration}

You can customize the Verdaccio configuration using a Kubernetes *configMap*.

#### Prepare {#prepare}

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml)
and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/packages/config/src/conf/docker.yaml -O config.yaml
```

**Note:** Make sure you are using the right path for the storage that is used for
persistency:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Deploy the configMap {#deploy-the-configmap}

Deploy the `configMap` to the cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Deploy Verdaccio {#deploy-verdaccio}

Now you can deploy the Verdaccio Helm chart and specify which configuration to
use:

```bash
helm install npm --set customConfigMap=verdaccio-config verdaccio/verdaccio
```

#### NGINX proxy body-size limit {#nginx-proxy-body-size-limit}

The standard k8s NGINX ingress proxy allows for 1MB for body-size which can be increased
by modifying the default deployment options according to the [documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-max-body-size):
```yaml
...

annotations:
...

    kubernetes.io/proxy-body-size: 20m
....    
...

```

## Rancher Support {#rancher-support}

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
