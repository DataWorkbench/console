#!/bin/bash

DEPLOY_ENV=new-testing
PROXY=172.31.60.2
WORKSPACE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )"

function sync_web() {
  cd "$WORKSPACE_DIR" || exit

  echo "copy dist to firstbox"
  rsync -rlptDzvh --delete dist/* root@$PROXY:/root/ethan/pitrix-webconsole-bigdata
  echo "done"

  echo "sync to testing1a-webservice0"
  ssh root@$PROXY rsync -rlptDzvh --delete /root/ethan/pitrix-webconsole-bigdata root@testing1a-webservice0:/pitrix/lib
  echo "done"

  echo "sync to testing1a-webservice1"
  ssh root@$PROXY rsync -rlptDzvh --delete /root/ethan/pitrix-webconsole-bigdata root@testing1a-webservice1:/pitrix/lib
  echo "done"
}


if [ "$1" = $DEPLOY_ENV ]; then
  sync_web
fi