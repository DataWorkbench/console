#!/bin/bash

# webservice机器上用，负责备份原代码，同步最新代码
#bak
echo "[0] start bak current file"

if [ ! -d /root/webapp/bak ];then
    mkdir -p /root/webapp/bak
fi

if [ -d /pitrix/lib/pitrix-webconsole-dataomnis ];then
	foldername=$(date +%Y%m%d)
	tar -czPf /root/webapp/bak/"$foldername".tar.gz /pitrix/lib/pitrix-webconsole-dataomnis
fi

echo '[1] unpack package'
tar xf /root/webapp/pitrix-webconsole-dataomnis.tgz
echo '[2] rsync file'
rsync -rlptDzvh --delete dist/* /pitrix/lib/pitrix-webconsole-dataomnis
echo '[4] reload nginx'
nginx -s reload
echo '[5] done'