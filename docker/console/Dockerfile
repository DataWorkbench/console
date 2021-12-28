FROM ubuntu:14.04
LABEL maintainer=wickyang@yunify.com name=webconsole

ENV DEBIAN_FRONTEND=noninteractive LANG=C.UTF-8
WORKDIR /pitrix/lib/pitrix-webconsole/

RUN /bin/bash -c set -evx -o pipefail \
    && sed -i s@/archive.ubuntu.com/@/mirrors.163.com/@g /etc/apt/sources.list \
    && sed -i s@/security.ubuntu.com/@/mirrors.163.com/@g /etc/apt/sources.list \
    && apt-get clean \
    && apt-get update -q \
    && apt-get upgrade -y -q \
    && apt-get install -y -q \
    git ssh openssl gcc g++ make tzdata \
    python2.7 python2.7-dev python-pip \
    swig zlib1g gettext libmemcached-dev \
    libc6-dev libffi-dev libjpeg-dev zlib1g-dev libssl-dev \
    libsasl2-dev libpq-dev libyaml-dev libfreetype6-dev \
    && apt-get autoremove \
    && apt-get clean \
    && mkdir -p /tmp/webconsole \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /tmp/requirements.txt
RUN pip install -i http://pypi.douban.com/simple -r /tmp/requirements.txt