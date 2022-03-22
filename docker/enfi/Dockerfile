From nginx:1.21.4
RUN rm /etc/nginx/conf.d/default.conf
COPY databench-web-nginx.conf.template /etc/nginx/templates/
ADD webroot /pitrix/lib/pitrix-webconsole-dataomnis/

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]