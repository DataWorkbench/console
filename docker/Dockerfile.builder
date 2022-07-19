FROM node:16.14.2-buster as node_modules

WORKDIR /root
RUN npm install -g npm@8.14.0

COPY . /root/
RUN npm cache clean --force && \
    npm install && \
    npm run build


FROM node:16.14.2-buster
WORKDIR /root/
COPY --from=node_modules /root/node_modules /root/node_modules
