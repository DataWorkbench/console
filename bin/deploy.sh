#!/bin/bash
NEW_TESTING=192.168.27.136
CONSOLE_PROXY=172.31.60.2
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

function sync_console_testing() {
  cd "$WORKSPACE_DIR" || exit

  echo "copy dist to firstbox"
  rsync -rlptDzvh --delete dist/* root@$CONSOLE_PROXY:/root/ethan/pitrix-webconsole-dataomnis
  echo "done"

  echo "sync to testing1a-webservice0"
  ssh root@$CONSOLE_PROXY rsync -rlptDzvh --delete /root/ethan/pitrix-webconsole-dataomnis root@testing1a-webservice0:/pitrix/lib
  echo "done"

  echo "sync to testing1a-webservice1"
  ssh root@$CONSOLE_PROXY rsync -rlptDzvh --delete /root/ethan/pitrix-webconsole-dataomnis root@testing1a-webservice1:/pitrix/lib
  echo "done"
}

if [ "$1" = 'testing' ]; then
  sync_testing
elif [ "$1" = 'docker_testing' ]; then
  sync_docker_conf
elif [ "$1" = 'console_testing' ]; then
  sync_console_testing
fi