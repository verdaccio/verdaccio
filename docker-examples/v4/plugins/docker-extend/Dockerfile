FROM verdaccio/verdaccio

USER root

ENV NODE_ENV=production

RUN npm i && npm -g install verdaccio-aws-s3-storage

USER verdaccio

