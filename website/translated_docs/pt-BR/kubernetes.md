---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. No entanto, o método recomendado para instalar o Verdaccio em um cluster de Kubernetes é usando [Helm](https://helm.sh). Helm é um gerenciador de pacotes do [Kubernetes](https://kubernetes.io) que traz múltiplas vantagens.

## Helm

### Configurando o Helm

Se você nunca usou Helm antes, você precisará configurar o controlador do Helm chamado Tiller:

```bash
helm init
```

### Instalação

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

### Implemente uma versão específica

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Atualizando o Verdaccio

```bash
helm upgrade npm verdaccio/verdaccio
```

### Desinstalando

```bash
helm uninstall npm
```

**Nota:** este comando apaga todos os recursos, incluindo pacotes que você pode ter publicado anteriormente no registro.


### Configuração personalizada do Verdaccio

Você pode personalizar a configuração do Verdaccio usando um Kubernetes *configMap*.

#### Preparo

Copie a [configuração existente](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) e adapte-a para o seu caso:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
```

**Nota:** Verifique se você está usando o caminho certo para o armazenamento usado pela persistência:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Implementando o configMap

Implemente o `configMap` no cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Lançando Verdaccio

Agora você pode lançar a tabela Verdaccio Helm e especificar qual configuração usar:

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

## Suporte Rancher

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
