---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. Jednakże, zalecana metoda do instalacji Verdaccio na Kubernetes grupie jest do użycia [Helm](https://helm.sh). Helm jest [Kubernetes](https://kubernetes.io) menedżerem pakietów, który przynosi wiele korzyści.

## Helm

### Setup Helm

Jeśli nie używałeś wcześniej Helm, musisz ustawić kontroler Helm zwany Tiller:

```bash
helm init
```

### Install

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

### Deploy a specific version

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Upgrading Verdaccio

```bash
helm upgrade npm verdaccio/verdaccio
```

### Odinstalowywanie

```bash
helm uninstall npm
```

**Note:** te polecenie usuwa wszystkie zasoby, w tym pakiety, które mógłbyś wcześniej opublikować w rejestrze.


### Niestandardowa konfiguracja Verdaccio

Możesz dostosować konfigurację Verdaccio za pomocą Kubernetes *configMap*.

#### Prepare

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
```

**Note:** Upewnij się, że używasz właściwej ścieżki do pamięci, która jest używana do utrzymywania:

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

Teraz możesz wdrożyć wykres Verdaccio Helm i określić konfigurację, której użyć:

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

## Rancher Support

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
