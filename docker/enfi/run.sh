#!/bin/bash

# 部署
# bash docker/enfi/run.sh deploy
# build容器然后运行
# bash docker/enfi/run.sh start

# ssh config
# Host bigdataweb
#     HostName 192.168.27.136
#     User root
#     Port 3333
#     IdentityFile ~/.ssh/id_rsa

SERVER=bigdataweb
WORKSPACE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." &> /dev/null && pwd )"
WORKSPACE=/data/webapp/enfi
WEBROOT="${WORKSPACE}/webroot"

function sync_web() {
  cd "$WORKSPACE_DIR" || exit

  echo 'start build'
  npm run build

  echo "sync files to newtesting"
  rsync -rvz docker/enfi/* root@$SERVER:$WORKSPACE
  rsync -rlptDzvh --delete dist/* root@$SERVER:$WEBROOT

  # echo 'build docker images for enfi and rerun enfi-web container'
  # ssh root@$SERVER 'bash /data/webapp/enfi/run.sh start'
  # echo "done"
}

function rebuild_run() {
  echo 'start build image'
  cd $WORKSPACE || exit
  docker stop enfi-web && docker rm enfi-web
  docker build -t enfiweb .
  echo 'build sucess! start run enfi-web container'
  # docker run -p 9999:80 --add-host global.databench.io:192.168.27.90 --name enfi-web -d enfiweb
  docker run -p 9999:80 --name enfi-web -d enfiweb
  echo 'done'
}


if [ "$1" = 'deploy' ]; then
  sync_web
elif [ "$1" = 'remote_start' ]; then
  echo 'build docker images for enfi and rerun enfi-web container'
  ssh root@$SERVER 'bash /data/webapp/enfi/run.sh start'
  echo "done"
elif [ "$1" = 'start' ]; then
  rebuild_run
fi