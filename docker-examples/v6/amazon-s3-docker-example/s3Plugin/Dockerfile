FROM verdaccio/verdaccio:6.x-next
LABEL Juan Picado <jotadeveloper@gmail.com>
# Copy the configuration file into the container
ADD config.yaml /verdaccio/conf/config.yaml
USER root
# This is the best way to install a plugin in Verdaccio
RUN npm install --global verdaccio-aws-s3-storage
USER $VERDACCIO_USER_UID

