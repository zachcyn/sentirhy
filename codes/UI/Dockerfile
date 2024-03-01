FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . /src

EXPOSE 3030

CMD ["node", "/src/main.jsx"]