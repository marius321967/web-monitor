#!/bin/bash

sed -i -E 's|^#(LoadModule rewrite_module modules/mod_rewrite\.so)|\1|g' /usr/local/apache2/conf/httpd.conf
sed -i -E 's|AllowOverride None|AllowOverride All|gi' /usr/local/apache2/conf/httpd.conf
sed -i -E 's|#Include conf/extra/httpd-vhosts.conf|Include conf/docker/httpd-vhosts.conf|' /usr/local/apache2/conf/httpd.conf
echo 'ServerName target' >> /usr/local/apache2/conf/httpd.conf
echo 'ServerName target2' >> /usr/local/apache2/conf/httpd.conf

httpd-foreground
