FROM dataomnis/console-builder:v0.9.0 as builder

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

