---
id: linking-remote-registry
title: "Vinculando um Registro Remoto"
---

Verdaccio é uma proxy e por padrão [conecta](uplinks.md) o registro público.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

Você pode conectar vários registros, o documento a seguir guiará você por algumas configurações úteis.

## Usando Associação de Escopo

A única maneira de acessar vários registros usando o `.npmrc` é com a função de escopo, da seguinte forma:

```
// .npmrc
registry=https://registry.npmjs.org
@mycompany:registry=http://localhost:4873
```

Essa abordagem é válida, mas apresenta várias desvantagens:

* Ela **apenas funciona com escopos**
* O escopo deve coincidir, **não são permitidas Expressões Regulares**
* Um escopo **não pode buscar vários registros**
* Tokens/passwords **devem ser definidos no ** `.npmrc` e registrados no repositório.

Veja um exemplo completo [aqui](https://stackoverflow.com/questions/54543979/npmrc-multiple-registries-for-the-same-scope/54550940#54550940).

## Vinculando um Registro

Vincular um registro é bastante simples. Primeiro, defina uma nova seção na seção `uplinks`. Note, a ordem aqui é irrelevante.

```yaml
  uplinks:
    private:
      url: https://private.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: private

```

Adicione uma seção `proxy` para definir o registro selecionado que você deseja usar como proxy.

## Vinculando Múltiplos Registros

```yaml
  uplinks:
    server1:
      url: https://server1.registry.net/npm
    server2:
      url: https://server2.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: server1 server2
```

Verdaccio suporta múltiplos registros no campo `proxy`. A solicitação será resolvida com o primeiro da lista; se este falhar, ele tentará com o próximo na lista e assim por diante.

## Registro Offline

Ter um Registro Offline completo é absolutamente possível. Se você não quiser nenhuma conectividade com controles remotos externos você pode fazer o seguinte.

```yaml

auth:
  htpasswd:
    file: ./htpasswd
uplinks:
packages:
  '@my-company/*':
    access: $all
    publish: none
  '@*/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
```

Remove todos os campos `proxy` de cada seção dos `pacotes`. O registro ficará totalmente offline.
