---
id: github-actions
title: "GitHub Actions"
---

С помощью [GitHub Actions](https://github.com/features/actions) вы можете автоматизировать свою работу, каждый экшн из GitHub Action выполняет определенный шаг.

![actions](/img/github-actions.png)

## Тестирование пакетов

Verdaccio provides a custom action for easy integration in your flow by adding the following to your workflow file's `steps` key.

```yaml
- name: Publish with Verdaccio
  uses: verdaccio/github-actions/publish@master
```

The action will perform a `npm publish` and if the publishing finishes successfully, the workflow will continue to the next step, otherwise the step will fail. If there are any issues publishing a package you will notice using this action.

Внутри использется docker-образ с плагинами `verdaccio-auth-memory` и `verdaccio-memory` (аутентификация и хранилище) для ускорения процесса.

Если хотите узнать больше про экшны, [посетите репозиторий](https://github.com/verdaccio/github-actions), выделенный под GitHub Actions.