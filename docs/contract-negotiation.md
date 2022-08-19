# Data Asset Negotiate Contract

## Description

Starting a contract negotiation. On success, it returns a confirmation that the Data Contract was valid and forwarded to the Data Provider.

## Request

### Header

Must have `Content-Type` specified as `application/ld+json`.

### Body

A valid Data Asset Self-Description as JSON-LD.

## Response

Error-checked for `Only negotiable` as true, `confirmation requirement` as true, `generalTerms` non empty and `hasLegallyBinding` check, and validated Data Asset Self-Description (as JSON-LD) signed by GX-DCS.

## Example

### Request

```
curl --location --request POST 'http://localhost:3000/make/contract' \
--header 'Content-Type: application/ld+json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjU0Njc4NDE1LCJleHAiOjE2NTQ2ODU2MTV9.Ide29-ZulR-W11avaW3oa-6tRCDD3lGq1rQUOTqkE8k' \
--data-raw '
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
            "@id": "https://gaia-dataasset.com/",
            "@context": {
                "@version": 1.1,
                "id": "@id",
                "type": "@type",
                "credentialSubject": {
                    "@id": "https://gaia-dataasset.com/credentialSubject",
                    "@context": {
                        "gax": "https://gaia-dataasset.com/"
                    }
                }
            }
        }
    ],
    "type": "VerifiablePresentation",
    "verifiableCredential": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                {
                    "@id": "https://gaia-dataasset.com/",
                    "@context": {
                        "@version": 1.1,
                        "id": "@id",
                        "type": "@type",
                        "credentialSubject": {
                            "@id": "https://gaia-dataasset.com/credentialSubject",
                            "@context": {
                                "gax": "https://gaia-dataasset.com/"
                            }
                        }
                    }
                }
            ],
            "type": [
                "VerifiableCredential"
            ],
            "credentialSubject": {
                "@id": "http://example.org/data-asset-1",
                "@type": "gax:DataAsset",
                "gax:title": "Example title",
                "gax:description": "Example description",
                "gax:keyword": [
                    "key",
                    "word"
                ],
                "gax:category": [
                    "example"
                ],
                "gax:publisher": "did:provider",
                "gax:creator": "?creatorDID",
                "gax:language": "http://id.loc.gov/vocabulary/iso639-1/en",
                "gax:distribution": {
                    "gax:title": "Example distribution title",
                    "gax:description": "Example distribution description",
                    "gax:created": "2021-01-23T18:25:43.511Z",
                    "gax:modified": "2021-01-25T12:20:34.007Z",
                    "gax:mediaType": "text/csv",
                    "gax:byteSize": "100000",
                    "gax:accessURL": "www.example.com/data/example.csv"
                },
                "gax:created": "2021-01-23T12:21:23.876Z",
                "gax:modified": "2021-01-24T14:45:03.517Z",
                "gax:containsPersonalData": false,
                "gax:sampleAvailable": false,
                "gax:contractOffer": {
                    "@type": "gax-GX-DCS:contractOffer",
                    "gax:choiceOfLaw": "iso:Germany",
                    "gax:generalTerms": "Example text for the general terms",
                    "gax:confirmationRequired": true,
                    "gax:loggingMode": "gax:LoggingMandatory",
                    "gax:circulationDetails": "Example text for the circulation details",
                    "gax:permission": {
                        "@type": "gax:Permission",
                        "gax:assigner": "?providerDID",
                        "gax:target": "?AssetURI",
                        "gax:action": "gax:USE",
                        "gax:negotiable": true,
                        "gax:postDuty": {
                            "@type": "gax:Duty",
                            "gax:action": {
                                "@id": "gax:LOG"
                            }
                        }
                    }
                },
                "gax:consumer": "did:consumer"
            },
            "issuanceDate": "2021-01-23T12:21:23.876Z",
            "issuer": "did:consumer:controller",
            "proof": [
                {
                    "type": "Ed25519Signature2018",
                    "created": "2022-08-18T12:08:01Z",
                    "verificationMethod": "did:consumer:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..DoLrISDflookLjocrvWuHcK4MWfLLlJF7pde6g9QGe5nPsGAwuXXvisRqUx2bvPt-uvkF1CNm8iQxqnH3mCvBA"
                }
            ]
        }
    ]
}
'
```

### Response

#### Success 200

```
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
            "@id": "https://gaia-dataasset.com/",
            "@context": {
                "@version": 1.1,
                "id": "@id",
                "type": "@type",
                "credentialSubject": {
                    "@id": "https://gaia-dataasset.com/credentialSubject",
                    "@context": {
                        "gax": "https://gaia-dataasset.com/"
                    }
                }
            }
        }
    ],
    "type": "VerifiablePresentation",
    "verifiableCredential": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                {
                    "@id": "https://gaia-dataasset.com/",
                    "@context": {
                        "@version": 1.1,
                        "id": "@id",
                        "type": "@type",
                        "credentialSubject": {
                            "@id": "https://gaia-dataasset.com/credentialSubject",
                            "@context": {
                                "gax": "https://gaia-dataasset.com/"
                            }
                        }
                    }
                }
            ],
            "type": [
                "VerifiableCredential"
            ],
            "credentialSubject": {
                "@id": "http://example.org/data-asset-1",
                "@type": "gax:DataAsset",
                "gax:title": "Example title",
                "gax:description": "Example description",
                "gax:keyword": [
                    "key",
                    "word"
                ],
                "gax:category": [
                    "example"
                ],
                "gax:publisher": "did:provider",
                "gax:creator": "?creatorDID",
                "gax:language": "http://id.loc.gov/vocabulary/iso639-1/en",
                "gax:distribution": {
                    "gax:title": "Example distribution title",
                    "gax:description": "Example distribution description",
                    "gax:created": "2021-01-23T18:25:43.511Z",
                    "gax:modified": "2021-01-25T12:20:34.007Z",
                    "gax:mediaType": "text/csv",
                    "gax:byteSize": "100000",
                    "gax:accessURL": "www.example.com/data/example.csv"
                },
                "gax:created": "2021-01-23T12:21:23.876Z",
                "gax:modified": "2021-01-24T14:45:03.517Z",
                "gax:containsPersonalData": false,
                "gax:sampleAvailable": false,
                "gax:contractOffer": {
                    "@type": "gax-GX-DCS:contractOffer",
                    "gax:choiceOfLaw": "iso:Germany",
                    "gax:generalTerms": "Example text for the general terms",
                    "gax:confirmationRequired": true,
                    "gax:loggingMode": "gax:LoggingMandatory",
                    "gax:circulationDetails": "Example text for the circulation details",
                    "gax:permission": [
                        {
                            "@type": "gax:Permission",
                            "gax:assigner": "?providerDID",
                            "gax:target": "?AssetURI",
                            "gax:action": "gax:USE",
                            "gax:negotiable": true,
                            "gax:postDuty": {
                                "@type": "gax:Duty",
                                "gax:action": {
                                    "@id": "gax:LOG"
                                }
                            }
                        }
                    ]
                },
                "gax:consumer": "did:consumer"
            },
            "issuanceDate": "2021-01-23T12:21:23.876Z",
            "issuer": "did:consumer:controller",
            "proof": [
                {
                    "type": "Ed25519Signature2018",
                    "created": "2022-08-18T12:08:01Z",
                    "verificationMethod": "did:consumer:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..DoLrISDflookLjocrvWuHcK4MWfLLlJF7pde6g9QGe5nPsGAwuXXvisRqUx2bvPt-uvkF1CNm8iQxqnH3mCvBA"
                }
            ]
        }
    ]
}
```

#### Forbidden 403

```
{
    "statusCode": 403,
    "message": "Forbidden – Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being",
    "stack": "ValidationException: Forbidden – Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being\n    at AgreementService.negotiate (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement.service.ts:105:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```

#### Unauthorized 401

```
{
    "statusCode": 401,
    "message": "Unauthorized – invalid consumer signature",
    "stack": "UnauthorizedException: Unauthorized – invalid consumer signature\n    at AgreementSignatureService.validateSignature (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement-signature.service.ts:36:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at AgreementService.negotiate (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement.service.ts:110:5)"
}

```

#### Validation error 430

```
{
    "statusCode": 430,
    "message": "Forbidden – Data Asset should have confirmation required",
    "stack": "ValidationException: Forbidden – Data Asset should have confirmation required\n    at AgreementService.negotiate (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement.service.ts:98:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
}

```

```
{
    "statusCode": 430,
    "message": "Data Asset is not negotiable",
    "stack": "HttpException: Data Asset is not negotiable\n    at AgreementService.negotiate (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement.service.ts:95:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
}

```
