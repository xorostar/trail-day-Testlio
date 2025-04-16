FROM node:22.1.0

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json

RUN npm ci

COPY . /app

RUN npm run build

EXPOSE 8080

CMD ["npx", "nodemon", "--exec", "ts-node", "index.ts"]
