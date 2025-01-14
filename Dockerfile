
FROM node:21-alpine


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . ./


EXPOSE 8001

CMD ["npm", "start"]
