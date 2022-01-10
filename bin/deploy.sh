#!/bin/bash
NEW_TESTING=192.168.27.136
WORKSPACE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )"


PRIKEY="${HOME}/.ssh/id_rsa"

function sync_testing() {
  cd "$WORKSPACE_DIR" || exit
  echo 'start build'
  npm run build
  echo 'start deploy'
  rsync -rlptDzvh --delete -e "ssh -p 3333 -i ${PRIKEY}" dist/* root@$NEW_TESTING:/data/webapp/pitrix-webconsole-dataomnis
  echo 'done!'
}

function sync_docker_conf() {
  cd "$WORKSPACE_DIR" || exit
  echo 'start deploy'
  rsync -rlptDzvh -e "ssh -p 3333 -i ${PRIKEY}" docker/console/* root@$NEW_TESTING:/data/webapp/docker
  echo 'done!'
}

function sync_console() {
  SERVICE=dataomnis
  PROJECT_NAME="pitrix-webconsole-$SERVICE"
  PROXY=$1
  WEBSERVICE0=$2
  WEBSERVICE1=$3
  PROXY_PATH=/root/ethan

  cd "$WORKSPACE_DIR" || exit

  echo "copy configs to dist"
  if [ -f dist/pitrix-webconsole-dataomnis.tgz ];then
    echo 'in this'
    rm dist/pitrix-webconsole-dataomnis.tgz
  fi
  cp -r configs dist/

  echo "making tarball ..."
  tar -czf dist/$PROJECT_NAME.tgz dist/*
  echo "done"

  echo "copy firstbox:$PROXY"
  rsync -avz --progress dist/$PROJECT_NAME.tgz root@"$PROXY":$PROXY_PATH
  echo "done"

  echo "sync to $WEBSERVICE0"
  ssh root@"$PROXY" rsync -avz $PROXY_PATH/$PROJECT_NAME.tgz root@"$WEBSERVICE0":$PROXY_PATH
  echo "done"

  echo "sync to $WEBSERVICE1"
  ssh root@"$PROXY" rsync -avz $PROXY_PATH/$PROJECT_NAME.tgz root@"$WEBSERVICE1":$PROXY_PATH
  echo "done"

  echo "backup $PROJECT_NAME on $WEBSERVICE0, copy new files"
  ssh root@"$PROXY" ssh "$WEBSERVICE0" sh $PROXY_PATH/refresh_console_portal.sh $SERVICE
  echo "done"

  echo "backup $PROJECT_NAME on $WEBSERVICE0, copy new files"
  ssh root@"$PROXY" ssh "$WEBSERVICE1" sh $PROXY_PATH/refresh_console_portal.sh $SERVICE
  echo "done"

  echo "clear dist"
  rm -r dist/configs
  rm dist/$PROJECT_NAME.tgz

}

if [ "$1" = 'testing' ]; then
  sync_testing
elif [ "$1" = 'testing_docker' ]; then
  sync_docker_conf
elif [ "$1" = 'console_testing' ]; then
  sync_console 172.31.60.2 testing1a-webservice0 testing1a-webservice1
elif [ "$1" = 'console_staging' ]; then
  sync_console 172.31.10.2 webservice0 webservice1
fi