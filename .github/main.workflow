workflow "New workflow" {
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
