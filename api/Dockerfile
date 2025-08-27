FROM node:22.17-alpine
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare yarn@4.9.4 --activate

ENV NODE_ENV=development
ENV YARN_NODE_LINKER=node-modules

EXPOSE 3000
CMD ["yarn", "start:dev"]
