FROM node:16-alpine
ENV NODE_ENV=development
WORKDIR /del_local
COPY ["package.json", "package-lock.json", "./"]
RUN npm i -g @nestjs/cli
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
