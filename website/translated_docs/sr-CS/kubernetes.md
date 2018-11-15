---
id: kubernetes
title: "Kubernetes"
---
Možete naći uputstva kako da izvršite deploy Verdaccio-a na Kubernetes klaster u [verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example) repozitorijumu. Ipak, preporučujemo da instalirate Verdaccio na Kubernetes klaster tako što ćete koristiti [Helm](https://helm.sh). Helm je [Kubernetes](https://kubernetes.io) package manager koji donosi mnoge pogodnosti.

## Helm

### Setup Helm

Ako ranije niste koristili Helm, potrebno je da podesite Helm kontroler zvani Tiller:

```bash
helm init
```

### Instaliranje

Deploy Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio) chart. U ovom primeru koristimo `npm` kao ime izdanja (release name):

```bash
helm install --name npm stable/verdaccio
```

### Postavljanje specifične verzije (deploy)

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### Nadogradjivanje Verdaccio-a

```bash
helm upgrade npm stable/verdaccio
```

### Deinstaliranje

```bash
helm del --purge npm
```

**Napomena:** ova komanda briše sve resurse, uključujući i pakete koji su možda ranije objavljeni u registriju.

### Koristnička Konfiguracija Verdaccio-a

Možete podesiti Verdaccio konfiguraciju po svojim željama tako što ćete koristiti Kubernetes *configMap*.

#### Priprema

Kopirajte [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml) i adaptirajte za svoju svrhu:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
```

**Napomena:** Proverite da li koristite ispravan path za storage koji se koristi za persistency:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Postavljanje configMap (deploy)

Postavite `configMap` na klaster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Postavite Verdaccio

Sada možete postaviti Verdaccio Helm chart i detaljno definisati konfiguraciju da koristi:

```bash
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Rancher Support

[Rancher](http://rancher.com/) je kompletna container management platforma koja Vam omogućava da na lak i jednostavan način koristite kontejnere.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)