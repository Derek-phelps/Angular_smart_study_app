FROM php:7.4-apache
RUN apt-get update && apt-get upgrade -y \
    nano \
    libzip-dev \
    zlib1g-dev \
    libonig-dev
RUN apt-get install -y libldap2-dev libpng-dev && \
    docker-php-ext-configure ldap && \
    docker-php-ext-install ldap && \
    docker-php-ext-install gd

# Add ldaps certificate (JUST FOR JR)
# COPY ldaps_certi.txt /home/ldaps_certi.txt
# RUN mv /etc/ssl/certs/ca-certificates.crt /home/ca-certificates.crt
# RUN cat /home/ldaps_certi.txt /home/ca-certificates.crt > /etc/ssl/certs/ca-certificates.crt
# Add ldaps certificate

# Trust self signed certificates for LDAP
RUN echo 'TLS_REQCERT never' >> /etc/ldap/ldap.conf
# Trust self signed certificates for LDAP

# CRON JOB
RUN apt-get -y install tzdata cron
RUN cp /usr/share/zoneinfo/Europe/Rome /etc/localtime && \
    echo "Europe/Rome" > /etc/timezone
RUN rm -rf /var/cache/apk/*
COPY cron/cron /etc/cron.d/cron
RUN chmod 0644 /etc/cron.d/cron
RUN crontab /etc/cron.d/cron
RUN mkdir -p /var/log/cron
RUN sed -i 's/^exec /service cron start\n\nexec /' /usr/local/bin/apache2-foreground
# CRON JOB

COPY smart-study.joanneum.at.crt /etc/apache2/ssl/server.crt
COPY smart-study.joanneum.at.key /etc/apache2/ssl/server.key
COPY virtual_host.conf /etc/apache2/sites-enabled/virtual_host.conf
RUN docker-php-ext-install mysqli pdo pdo_mysql zip mbstring
RUN docker-php-ext-enable mysqli
RUN docker-php-ext-install zip
RUN a2enmod headers 
RUN sed -ri -e 's/^([ \t]*)(<\/VirtualHost>)/\1\tHeader set Access-Control-Allow-Origin "*"\n\1\2/g' /etc/apache2/sites-available/*.conf
ENV TERM xterm
RUN a2enmod rewrite
RUN echo "ServerName smart-study.joanneum.at" >> /etc/apache2/apache2.conf
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf
RUN chgrp -R www-data /var/www
RUN find /var/www -type d -exec chmod 775 {} +
RUN find /var/www -type f -exec chmod 664 {} +
RUN a2enmod ssl
RUN a2enmod authnz_ldap
RUN service apache2 restart
EXPOSE 80
EXPOSE 443
