FROM node:6

RUN mkdir -p /node/app && chown -R node:node /node

USER node

COPY package.json /node/package.json
RUN cd /node && npm install

WORKDIR /node/app
COPY . /node/app

CMD [""]
ENTRYPOINT ["npm"]
