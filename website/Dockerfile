FROM node:lts-alpine

# Create the docs website directory
COPY . /verdaccio-website

WORKDIR /verdaccio-website/website

RUN apk add --no-cache -t build-deps make gcc g++ python libtool autoconf automake && \
    yarn install && \
    apk del build-deps

EXPOSE 3000

CMD ["yarn", "start"]
