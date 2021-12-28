#!/bin/bash

cd "$( dirname "$0" )" || exit
settingfile="./web_console_settings.py"

if [ ! -f "$settingfile" ]; then
  echo "canot find file:web_console_settings.py"
  exit
fi

cmd="$1"

if [ "$cmd" = start ]
then
  docker-compose up -d
elif [ "$cmd" = stop ]
then 
  docker-compose stop
elif [ "$cmd" = ps ]
then 
  docker-compose ps
fi