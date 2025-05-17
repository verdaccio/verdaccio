# Use the official Alpine-based NGINX image
FROM nginx:alpine

# Remove the default site
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom vhost configs
# (make sure the local folder contains *.conf files)
ADD sites-enabled /etc/nginx/conf.d
