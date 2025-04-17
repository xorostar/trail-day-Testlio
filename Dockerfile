FROM node:20.11.1

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json

# Install dependencies
RUN npm ci && rm -rf /root/.npm

COPY . /app

RUN npm run build

EXPOSE 8080

CMD ["npx", "nodemon", "--exec", "ts-node", "index.ts"]
