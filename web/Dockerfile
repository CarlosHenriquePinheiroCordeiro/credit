FROM node:22.17.1-alpine

WORKDIR /app

ENV CHOKIDAR_USEPOLLING=true \
    HOST=0.0.0.0 \
    PORT=5173

COPY package.json yarn.lock* ./
COPY .yarn/ .yarn/

RUN corepack enable && yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]
