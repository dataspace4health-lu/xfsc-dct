FROM node:16-alpine
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /dct_local
COPY ["package.json", "package-lock.json", "./"]
RUN npm config set @gaia-x:registry https://gitlab.com/api/v4/projects/38989724/packages/npm/
RUN npm i -g @nrwl/cli
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "run", "start"]
