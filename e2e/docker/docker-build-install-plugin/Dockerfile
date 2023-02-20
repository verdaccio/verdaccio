FROM verdaccio/verdaccio:nightly-master
LABEL Juan Picado <jotadeveloper@gmail.com>
ADD docker.yaml /verdaccio/conf/config.yaml  
USER root
RUN npm install --global verdaccio-static-token \
  && npm install --global verdaccio-memory  \
  && npm install --global verdaccio-auth-memory
USER $VERDACCIO_USER_UID
