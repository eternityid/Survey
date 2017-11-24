FROM nginx:alpine

WORKDIR /opt

RUN apk add --update \ 
    apache2-utils \
    nano \
    && \
    rm -rf /var/cache/apk/*

COPY basic-auth.conf entrypoint.sh ./
RUN chmod 0755 ./entrypoint.sh

CMD ["/opt/entrypoint.sh"]
