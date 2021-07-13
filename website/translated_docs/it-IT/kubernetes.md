---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. Tuttavia, il metodo raccomandato per l'installazione di Verdaccio su un cluster Kubernetes è di utilizzare [Helm](https://helm.sh). Helm è un gestore di pacchetti [Kubernetes](https://kubernetes.io) che trae molteplici vantaggi.

## Helm

### Configurare Helm

Se non si è mai usato Helm prima d'ora, è necessario configurare il controller chiamato Tiller:

```bash
helm init
```

### Installazione

> ⚠️ If you are using this helm chart, please [be aware of the migration of the repository](https://github.com/verdaccio/verdaccio/issues/1767).

Deploy the Helm [verdaccio/verdaccio](https://github.com/verdaccio/charts) chart.

### Add repository

```
helm repo add verdaccio https://charts.verdaccio.org
```

In questo esempio usiamo `npm` come nome della release:

```bash
helm install npm verdaccio/verdaccio
```

### Sviluppare una versione specifica

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Aggiornamento di Verdaccio

```bash
helm upgrade npm verdaccio/verdaccio
```

### Disinstallazione

```bash
helm uninstall npm
```

**Nota:** questo comando cancella tutte le risorse, inclusi i pacchetti che potresti aver pubblicato precedentemente sul registro.


### Configurazione personalizzata di Verdaccio

È possibile personalizzare la configurazione di Verdaccio utilizzando un Kubernetes *configMap*.

#### Preparazione

Copiare la [configurazione esistente](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) e adattarla al proprio caso d'uso:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
```

**Nota:** Assicurarsi che si stia utilizzando il percorso corretto per l'archiviazione che viene usato per la persistenza:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Sviluppare il configMap

Sviluppare il `configMap` nel cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Sviluppare Verdaccio

Ora è possibile sviluppare il grafico Verdaccio Helm e specificare quale configurazione utilizzare:

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

## Supporto Rancher

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
