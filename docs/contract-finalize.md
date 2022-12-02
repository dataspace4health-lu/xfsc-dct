# Data Asset Finalize Contract

## Description

This is necessary for Agreements negotiated via the “/negotiate” endpoint. The Provider sends a request to the “/finalize“ endpoint which contains the Agreement signed by him and the Data Consumer. To finalize an Agreement, the GX-DCS MUST first validate, that the signatures of both the Data Provider and the Data Consumer are valid. Public keys of already resolved DIDs MAY be cached for 24 hours (note that DID resolving could take several seconds). If the GX-DCS has confirmed the validity of both signatures it MUST sign the Agreement while including the signatures of Data Provider and Data Consumer in the hash. After signing the Agreement, the GX-DCS MUST send the finalized Agreement to Data Provider and Data Consumer.

## Request

### Header

Must have `Content-Type` specified as `application/ld+json`.

### Body

A valid Data Asset Self-Description as JSON-LD.

## Response

Error-checked for `hasLegallyBinding`, and validated Data Asset Self-Description (as JSON-LD) signed by GX-DCS.

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
                    "gax:accessURL": "www.example.com/data/example.csv",
                    "gax:hasLegallyBindingAddress": "www.example.com/fc/transfer-contract-offers?hasLegallyBindingAddress=something"
                },
                "gax:created": "2021-01-23T12:21:23.876Z",
                "gax:modified": "2021-01-24T14:45:03.517Z",
                "gax:containsPersonalData": false,
                "gax:sampleAvailable": false,
                "gax:contractOffer": {
                    "@type": "gax-GX-DCS:contractOffer",
                    "gax:choiceOfLaw": "iso:Germany",
                    "gax:generalTerms": "General terms",
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
                    "created": "2022-08-18T12:21:27Z",
                    "verificationMethod": "did:provider:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..OkFFKeG-5-2DFpjyQcXfRN7F1B-Fz1B79PVJEiKI6Yj4-TuYCdvYCUKQwqlP_qcfsKrVvO9lOkBSsL8JKUDBCA"
                },
                {
                    "type": "Ed25519Signature2018",
                    "created": "2022-08-18T12:21:27Z",
                    "verificationMethod": "did:consumer:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..8DQsBqiQDtGI6_77WLqTiEwmW73hA5-Rd57pm959nokHDF1nujEATcYkR8n4oL3QfzZWcyWw0LxDFyCLGmqhAQ"
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
        "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
        "VerifiablePresentation"
    ],
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
                    "gax:accessURL": "www.example.com/data/example.csv",
                    "gax:hasLegallyBindingAddress": "www.example.com/fc/transfer-contract-offers?hasLegallyBindingAddress=something"
                },
                "gax:created": "2021-01-23T12:21:23.876Z",
                "gax:modified": "2021-01-24T14:45:03.517Z",
                "gax:containsPersonalData": false,
                "gax:sampleAvailable": false,
                "gax:contractOffer": {
                    "@type": "gax-GX-DCS:contractOffer",
                    "gax:choiceOfLaw": "iso:Germany",
                    "gax:generalTerms": "General terms",
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
                    "created": "2022-08-18T12:21:27Z",
                    "verificationMethod": "did:provider:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..OkFFKeG-5-2DFpjyQcXfRN7F1B-Fz1B79PVJEiKI6Yj4-TuYCdvYCUKQwqlP_qcfsKrVvO9lOkBSsL8JKUDBCA"
                },
                {
                    "type": "Ed25519Signature2018",
                    "created": "2022-08-18T12:21:27Z",
                    "verificationMethod": "did:consumer:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..8DQsBqiQDtGI6_77WLqTiEwmW73hA5-Rd57pm959nokHDF1nujEATcYkR8n4oL3QfzZWcyWw0LxDFyCLGmqhAQ"
                }
            ]
        }
    ],
    "proof": {
        "type": "Ed25519Signature2018",
        "created": "2022-08-18T13:39:36Z",
        "verificationMethod": "did:dcs:key:123",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..EqLD27VScNodtHSilQXVdkSP-rD24nLtwc6tIJTGp1DpvlZrpVoep5iXLMmTECBRFKOXG1NPhI1ME4R5okrnCw"
    }
}
```

#### Unauthorized 401

```
{
    "statusCode": 401,
    "message": "Unauthorized – invalid consumer signature",
    "stack": "UnauthorizedException: Unauthorized – invalid consumer signature\n    at AgreementSignatureService.validateSignature (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement-signature.service.ts:36:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at AgreementService.finalize (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement.service.ts:130:5)"
}
```

```
{
    "statusCode": 401,
    "message": "Unauthorized – invalid provider signature",
    "stack": "UnauthorizedException: Unauthorized – invalid provider signature\n    at AgreementSignatureService.validateSignature (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement-signature.service.ts:36:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at AgreementService.finalize (/Users/grigorovicimonica/Documents/work/qualitance/dct/dist/apps/api/webpack:/dct/apps/api/src/agreement/services/agreement.service.ts:129:5)"
}
```
