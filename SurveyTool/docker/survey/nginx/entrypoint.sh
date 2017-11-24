#!/bin/sh

echo $TITLE
echo $HOST
echo $PORT
echo $USER

cp basic-auth.conf /etc/nginx/conf.d/default.conf
sed -e "s/Admin/$TITLE/" -i /etc/nginx/conf.d/default.conf
sed -e "s/elastic_host/$HOST/" -i /etc/nginx/conf.d/default.conf
sed -e "s/80/$PORT/" -i /etc/nginx/conf.d/default.conf
sed -e "s/head_host/$HEADHOST/" -i /etc/nginx/conf.d/default.conf
sed -e "s/81/$HEADPORT/" -i /etc/nginx/conf.d/default.conf

htpasswd -c -b /etc/nginx/.htpasswd $USER $PASS

echo "/etc/nginx/conf.d/default.conf"
cat /etc/nginx/conf.d/default.conf

echo "/etc/nginx/.htpasswd"
cat /etc/nginx/.htpasswd

nginx -g "daemon off;"