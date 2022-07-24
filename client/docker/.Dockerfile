FROM node:16-alpine


RUN apk add --no-cache libc6-compat

COPY wrapper/package.json package.json
COPY wrapper/yarn.lock yarn.lock
COPY wrapper/package-lock.json wrapper/yarn.lock ./
RUN ["yarn", "install"]

COPY ./wrapper/public .
COPY ./wrapper/src .
COPY ./wrapper/postcss.config.js .
COPY ./wrapper/tailwind.config.js .
COPY ./wrapper .

RUN npm install react-scripts --save

ENV HTTPS=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV HOST=0.0.0.0
ENV PORT=3000


CMD ["yarn", "start"]
