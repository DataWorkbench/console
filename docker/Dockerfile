FROM ubuntu:14.04
LABEL maintainer=wickyang@yunify.com name=webconsole

ENV DEBIAN_FRONTEND noninteractive
WORKDIR /pitrix/lib/pitrix-webconsole/

COPY ./requirements.txt /tmp/requirements.txt

RUN /bin/bash -c set -evx -o pipefail \
    && sed -i s@/archive.ubuntu.com/@/mirrors.163.com/@g /etc/apt/sources.list \
    && sed -i s@/security.ubuntu.com/@/mirrors.163.com/@g /etc/apt/sources.list \
    && apt-get clean \
    && apt-get update -q \
    && apt-get upgrade -y -q \
    && apt-get install -y -q \
    git ssh openssl gcc g++ make  \
    python2.7 python2.7-dev python-pip \
    swig zlib1g gettext libmemcached-dev \
    libc6-dev libffi-dev libjpeg-dev zlib1g-dev libssl-dev \
    libsasl2-dev libpq-dev libyaml-dev libfreetype6-dev \
    && apt-get autoremove \
    && apt-get clean \
    && mkdir -p /tmp/webconsole \
    && pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ -r /tmp/requirements.txt
