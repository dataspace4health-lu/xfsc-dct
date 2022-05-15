FROM node:16-alpine
ENV NODE_ENV=development
WORKDIR /del_local
COPY ["package.json", "package-lock.json", "./"]
RUN npm i -g @nestjs/cli
RUN npm install --force
COPY . .
EXPOSE 3000
# RUN npm run build
CMD ["npm", "run", "start:dev"]
