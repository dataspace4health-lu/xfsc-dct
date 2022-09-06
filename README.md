
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm config set @gaia-x:registry https://gitlab.com/api/v4/projects/38989724/packages/npm/
$ npm install
```

## Formatting

```bash
# Setting the hooksPath will run the pre-commit hook in order to standardize the formatted output
$ git config core.hooksPath .github/hooks
```

## Running the app

### Environment Variables
```
# General
NODE_ENV=development # development/production
REQUEST_SIZE=1000000 # request max size in bytes 
NX_API_ENDPOINT=http://localhost:3000/ # used in Frontend App to connect to api
SERVER_THROTLLER_TTL=60 # throtller period
SERVER_THROTLLER_LIMIT=10 # maximum number of requests for specified period
LOGGER_TYPE=console # types "console"/"winston"
LOGGER_WINSTON_LEVEL=info
LOGGER_WINSTON_TRANSPORTS_CONSOLE=true
LOGGER_WINSTON_TRANSPORTS_FILE=logs/app.log # filename to store logs
CACHE_TYPE=redis # types "memory"/"redis"
CACHE_TTL=86400 # cache time to live for gateways
SD_CACHE_TTL=1209600000 # 14 days in milliseconds
SD_QUEUE_DELAY=86400000 # 24 hours in milliseconds
SD_QUEUE_RETRIES=13 # QUEUE RETRIES
REDIS_HOST=redis-server
REDIS_PORT=6379
REDIS_PREFIX=cache:
DELS_LINK=https://dels.gaia-x.com/inbox/
DELS_REL=http://www.w3.org/ns/ldp#inbox
DELS_CONTEXT=https://www.w3.org/ns/ldp
DELS_ID=https://dcs.gaia-x.com/contracts/1001
DELS_INBOX=https://dels.gaia-x.com/inbox/
TRUST_SERVICE_URL=https://trust-service.com # Trust Service Url 
FEDERATED_CATALOG_URL=https://federated-catalog.com # Federated Catalog Url
#Ed25519 signature configuration 
SIGNATURE_ID=did:dcs:key:123
SIGNATURE_TYPE=Ed25519VerificationKey2018
SIGNATURE_CONTROLLER=did:dcs:controller
SIGNATURE_PUBLIC_KEY_BASE58=45dxsXGjMixWNfmXBtWwPnCfGgV1THf6qhdLixUmgrVZ
SIGNATURE_PRIVATE_KEY_BASE58=3hJ4PNJm6pzUwRLDpummeZCZGeqE7c9DMdD6qSNB4qBfxrnkAUmZ1CQMpifvihdiSv8pepijdCzR5C2eAHC4Vqf9

LOG_TOKEN_JWT_SECRET_KEY=somesecretkey # secret key 
LOG_TOKEN_EXPIRES_IN_MINUTES=120 # log token expiration time

```

```bash
# development
$ npm run start

# docker
$ docker-compose up --build

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### API in dev mode

Available APIs:

- `http://localhost:3000/register`
- `http://localhost:3000/make/contract`
- `http://localhost:3000/negotiate`
- `http://localhost:3000/finalize`
- `http://localhost:3000/validate`
- `http://localhost:3000/log/token/validate`
- `http://localhost:3000/contracts/inbox-discovery`

#### UI in dev mode

- Available route: `http://localhost:3001/ui`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

```
# available route: `http://localhost:8000/contracts-inbox/`
$ docker compose up
```

