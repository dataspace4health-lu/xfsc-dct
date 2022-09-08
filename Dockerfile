FROM node:16-alpine as builder
RUN apk --no-cache add --virtual .builds-deps build-base python3
WORKDIR /dct_local
COPY ["package.json", "package-lock.json", "./"]
RUN npm config set @gaia-x:registry https://gitlab.com/api/v4/projects/38989724/packages/npm/
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine as runtime
WORKDIR /dct_local
COPY ["package.json", "package-lock.json", "./"]
RUN npm config set @gaia-x:registry https://gitlab.com/api/v4/projects/38989724/packages/npm/
RUN npm ci --only=production
COPY --from=builder /dct_local/dist ./dist
EXPOSE 3000

CMD ["npm", "run", "start:prod"]

# RUN npm ci --legacy-peer-deps
# ENV NX_DAEMON=false
# ENV NX_SKIP_NX_CACHE=true
# COPY --chown=node:node . .
# RUN npm run build
# ENV NODE_ENV=production


