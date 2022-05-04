FROM node:16.14.2-buster as node_modules

WORKDIR /root

COPY . /root/
RUN npm install && npm run build


FROM node:16.14.2-buster
WORKDIR /root/
COPY --from=node_modules /root/node_modules /root/node_modules

