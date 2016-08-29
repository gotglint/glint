FROM ubuntu:16.04

MAINTAINER Michael Laccetti <michael@laccetti.com> (https://laccetti.com/)

EXPOSE 9080 9090

WORKDIR /opt/glint

RUN apt-get update && \
  apt-get dist-upgrade -y && \
  apt-get install -y build-essential curl git && \
  curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
  apt-get install -y nodejs

RUN npm install -g gulp codecov node-gyp

CMD /bin/bash
