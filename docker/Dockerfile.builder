FROM node:16.14.2-buster as node_modules

WORKDIR /root
<<<<<<< HEAD

COPY . /root/
RUN npm install && npm run build
=======
RUN npm install -g npm@8.14.0

COPY . /root/
RUN npm cache clean --force && \
    npm install && \
    npm run build
>>>>>>> e4553b424ea25a5c2d47eded5f3265b07fab7b9c


FROM node:16.14.2-buster
WORKDIR /root/
COPY --from=node_modules /root/node_modules /root/node_modules
<<<<<<< HEAD

=======
>>>>>>> e4553b424ea25a5c2d47eded5f3265b07fab7b9c
