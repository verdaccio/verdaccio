FROM nginx

COPY cert.crt /etc/nginx/cert.crt
COPY cert.key /etc/nginx/cert.key
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY run.sh /run.sh

ENV REMOTE_URL="http://localhost:8080/"

CMD ["/run.sh"]
