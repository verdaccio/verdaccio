# run yarn docker to get this tag
FROM verdaccio/verdaccio:local

USER root

# Comment out for better performance
# ENV NODE_ENV=production

RUN yarn config set enableProgressBars true && \
    yarn config set enableTelemetry true && \
    yarn config set enableGlobalCache false && \
    yarn install && \
    yarn add verdaccio-aws-s3-storage
    
USER verdaccio

