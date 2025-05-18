# Light, maintained NGINX build
FROM nginx:alpine

# Remove the default vhost
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom server block
COPY verdaccio.conf /etc/nginx/conf.d/verdaccio.conf
