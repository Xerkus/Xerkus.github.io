FROM node:5

ADD package.json /node/package.json
RUN cd /node && npm install --loglevel=warn

ARG USER_ID
RUN useradd -u "${USER_ID:?must not be empty}" -ms /bin/bash node
USER node

VOLUME /node/app
WORKDIR /node/app

CMD [""]
ENTRYPOINT ["/node/node_modules/.bin/gulp"]
