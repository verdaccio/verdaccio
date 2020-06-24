---
id: kubernetes
title: "Kubernetes"
---

 Instrukce, jak nasadit Verdaccio do Kuberneter clusteru najdete v repozitáři [verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example). Nicméně doporučená metoda instalace Verdaccia do Kubernetes clusteru je pomocí [Helm](https://helm.sh). Helm je balíčkový správce pro [Kubernetes](https://kubernetes.io) což přináší mnoho výhod.

## Helm

### Nastavení Helm

Pokud jste ještě nepoužívali Help, budete muset nastavit ovladač pro Helm jménem Tiller:

```bash
helm init
```

### Instalace

Nasazení Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio) grafu. V tomto příkladu použijeme `npm` jako název releasu:

```bash
helm install --name npm stable/verdaccio
```

### Nasazení specifické verze

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### Aktualizace Verdaccia

```bash
helm upgrade npm stable/verdaccio
```

### Odinstalace

```bash
helm del --purge npm
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
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Podpora Rancher

[Rancher](http://rancher.com/) je platforma pro kompletní správu kontejnerů která nabízí velice jednoduchou správu a používání kontejnerá na produkci.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)