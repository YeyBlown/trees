FROM node:16-alpine

COPY package.json package.json
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN npm install --frozen-lockfile

COPY . .

ENV HTTPS=true
ENV DISABLE_ESLINT_PLUGIN=true

RUN ["npm", "build"]
CMD ["npm", "start"]
