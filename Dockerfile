FROM node:alpine

WORKDIR /app/geo-api

CMD [ "yarn", "start:dev" ]