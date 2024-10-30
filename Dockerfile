FROM httpd:2.4-alpine

RUN apk update && apk add --no-cache wget

COPY ./public/ /usr/local/apache2/htdocs/
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf

# copy helping scripts
COPY ./scripts/ /app/scripts/

# prepare cron folders, and copy the scripts
COPY ./cron/ /etc/periodic/
RUN chmod -R a+x /app/scripts
RUN /app/scripts/cron-setup.sh
RUN chmod -R a+x /etc/periodic
