FROM node:20.11.0

WORKDIR /frontend

COPY . .

RUN yarn

CMD ["yarn", "start"]