workflow "New workflow" {
  on = "push"
  resolves = ["Docker build health check"]
}

action "Docker build health check" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  args = "build ."
}
