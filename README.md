# DCT



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/gaia-x/data-infrastructure-federation-services/dct/dct.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/gaia-x/data-infrastructure-federation-services/dct/dct/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!).  Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README
Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

## Open Items:
- FederatedCatalogAdapter needs to be implemented
```
/**
*  Should return Data Asset validation result "DataAssetStatus",consisting of retrieving original Data Asset and compare them and check if provided Data Asset is still supported
*/
validateDataAsset(dataAsset: DataAsset): Promise<DataAssetStatus>;
/**
* Return Data Asset without consumer details that should be applied in provider's signature validation
*/
removeConsumerDetails(dataAsset: IVerifiableCredential<DataAsset>):Promise<IVerifiableCredential<DataAsset>>;
/**
* Return proof that was signed by provider
*/
getProviderProof(dataAsset: DataAsset): Promise<{ verificationMethod: string }>;
/**
* Return proof that was signed by consumer
*/
getConsumerProof(dataAsset: DataAsset): Promise<{ verificationMethod: string }>;
/**
* The GX-DCS MUST check if the Consumer conforms to the policies, insofar that is technically feasible with fungible effort.
*/
isConsumerConformPolicies(dataAsset: DataAsset): Promise<boolean>;
/**
* Return true if Federated Catalog service is UP, otherwise false
*/
isHealthy(): Promise<boolean>;
```
- AbstractLogTokenAdapter
```
/**
* Generate Log Token for provided Data Asset
*/
getLogToken(dataAsset: DataAsset): Promise<LogToken>;
```
- AbstractTrustServiceAdapter
```
/**
* Validate participant verifies that the user is a GX Participant
* In general, only Gaia-X Participants must be able to interact with the GX-DCS.
* Each participant shall be capable of registering Data Assets, negotiate,
* or make a Data Contracts for a Data Asset and get a validation confirmation
* for a finalized Agreement.
*/
validateParticipant(dataAsset: DataAsset, type: ParticipantType): Promise<ParticipantStatus>;
/**
* Return true if Trust Service service is UP, otherwise false
*/
isHealthy(): Promise<boolean>;
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

Swagger path:
 - `/swagger`

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
