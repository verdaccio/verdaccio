---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. Nicméně doporučená metoda instalace Verdaccia do Kubernetes clusteru je pomocí [Helm](https://helm.sh). Helm je balíčkový správce pro [Kubernetes](https://kubernetes.io) což přináší mnoho výhod.

## Helm

### Nastavení Helm

Pokud jste ještě nepoužívali Help, budete muset nastavit ovladač pro Helm jménem Tiller:

```bash
helm init
```

### Instalace

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

### Nasazení specifické verze

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Aktualizace Verdaccia

```bash
helm upgrade npm verdaccio/verdaccio
```

### Odinstalace

```bash
helm uninstall npm
```

**Poznámka:** tento příkaz odstraní všechny prostředky včetně balíčků, které jste dříve publikovali do registru.


### Vlastní konfigurace Verdaccia

Můžete upravit konfiguraci Verdaccia pomocí Kubernetes *configMap*.

#### Příprava

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
```

**Poznámka:** Zkontrolujte, zda používáte správnou cestu pro ukládání, která slouží pro perzistenci dat:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Nasazení configMap

Nasaďte `configMap` do clusteru

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Nasazení Verdaccia

Nyní můžete nasadit Verdaccio Helm graf a specifikovat, jakou konfiguraci použít:

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
...

```

## Podpora Rancher

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
