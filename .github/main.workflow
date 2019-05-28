workflow "Docker && Publish Pre-check" {
  resolves = [
    "Docker build health check",
    "Test Publish Verdaccio",
  ]
  on = "push"
}

action "Docker build health check" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  args = "build ."
  env = {
    VERDACCIO_BUILD_REGISTRY = "https://registry.verdaccio.org"
  }
}

action "Test Publish Verdaccio" {
  uses = "verdaccio/github-actions/publish@v0.1.0"
  needs = ["Docker build health check"]
  args = "-d"
}

workflow "release" {
  resolves = [
    "github-release",
    "release:lint",
    "release:build",
  ]
  on = "push"
}

action "release:tag-filter" {
  uses = "actions/bin/filter@master"
  args = "tag v*"
}

action "release:install" {
  uses = "docker://node:10"
  needs = ["release:tag-filter"]
  args = "yarn install --frozen-lockfile"
}

action "release:build" {
  uses = "docker://node:10"
  needs = ["release:install"]
  args = "yarn run code:build"
}

action "release:lint" {
  uses = "docker://node:10"
  needs = ["release:install"]
  args = "yarn run lint"
}

action "release:test" {
  uses = "docker://node:10"
  needs = ["release:build"]
  args = "sh scripts/puppeteer-setup-ci.sh"
}

action "release:publish" {
  needs = ["release:test"]
  uses = "docker://node:10"
  args = "sh scripts/publish.sh"
  secrets = [
    "REGISTRY_AUTH_TOKEN",
  ]
  env = {
    REGISTRY_URL = "registry.npmjs.org"
  }
}

action "github-release" {
  needs = ["release:publish"]
  uses = "docker://node:10"
  args = "sh scripts/github-release.sh"
  secrets = [
    "GITHUB_TOKEN",
  ]
}

action "branch-filter" {
  uses = "actions/bin/filter@master"
  args = "branch"
}

action "install" {
  needs = ["branch-filter"]
  uses = "docker://node:10"
  args = "yarn install --frozen-lockfile"
}

action "build" {
  uses = "docker://node:10"
  needs = ["install"]
  args = "yarn run code:build"
}

action "lint" {
  uses = "docker://node:10"
  needs = ["install"]
  args = "yarn run lint"
}
