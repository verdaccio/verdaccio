# check=skip=CopyIgnoredFile
# `COPY . .` intentionally relies on .dockerignore to drop node_modules, dotfiles,
# etc. so the image installs cleanly — the CopyIgnoredFile lint warning is expected.

# CI image: performs a clean install, builds every package and runs the unit
# tests. The image build itself is the verification — if install, build or any
# test fails, `docker build` exits non-zero.
#
# The build context MUST be the repository root (the whole pnpm workspace and
# lockfile are required), so this Dockerfile is invoked from root via:
#
#   pnpm docker:test
#
# which expands to:
#
#   docker build -f packages/tools/Dockerfile -t verdaccio/ci-test:local . --no-cache

FROM node:24-alpine

# development deps are needed to build and test the packages
ENV NODE_ENV=development \
    VERDACCIO_BUILD_REGISTRY=https://registry.npmjs.org \
    CI=true

# toolchain required to compile native dependencies during install
RUN apk --no-cache add ca-certificates g++ gcc libgcc libstdc++ linux-headers make python3

WORKDIR /opt/verdaccio-build

COPY . .

# clean install (frozen lockfile), build all packages, then run the unit tests
RUN npm -g i corepack && \
    corepack install && \
    pnpm config set registry $VERDACCIO_BUILD_REGISTRY && \
    pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm run build && \
    pnpm run test
