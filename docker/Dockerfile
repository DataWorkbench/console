<<<<<<< HEAD
FROM dataomnis/console-builder:v0.9.0 as builder
=======
FROM dataomnis/console-builder:v1.0.0 as builder
>>>>>>> e4553b424ea25a5c2d47eded5f3265b07fab7b9c

WORKDIR /root

COPY . /root/
RUN npm run build


############################################################
From nginx:1.21.4

RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/console-nginx.conf.template /etc/nginx/templates/
COPY --from=builder /root/dist /pitrix/lib/pitrix-webconsole-dataomnis/

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]

