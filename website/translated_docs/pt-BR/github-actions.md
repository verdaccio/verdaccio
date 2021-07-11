---
id: github-actions
title: "GitHub Actions"
---

Com [GitHub Actions](https://github.com/features/actions) você pode automatizar seu fluxo de trabalho, cada GitHub Action executa uma etapa específica em um processo.

![actions](/img/github-actions.png)

## Testando os seus pacotes

Verdaccio provides a custom action for easy integration in your flow by adding the following to your workflow file's `steps` key.

```yaml
- name: Publish with Verdaccio
  uses: verdaccio/github-actions/publish@master
```

The action will perform a `npm publish` and if the publishing finishes successfully, the workflow will continue to the next step, otherwise the step will fail. If there are any issues publishing a package you will notice using this action.

Dentro da imagem usa-se os plugins `verdaccio-auth-memory` e `verdaccio-memory` para gerenciar autenticação e armazenamento para acelerar o processo.

Se você quiser saber mais sobre a ação, [visite nosso repositório ](https://github.com/verdaccio/github-actions) dedicado ao GitHub Actions.
