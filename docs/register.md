# Data Asset Registration

## Description

Registers a Data Asset and on success returns a valid Data Asset Self-Description signed by GX-DCS.

## Request

### Header

Must have `Content-Type` specified as `application/ld+json`.

### Body

A valid Data Asset Self-Description as JSON-LD.

## Response

Error-checked, and validated Data Asset Self-Description (as JSON-LD) signed by GX-DCS.

## Example

### Request

```
curl --location --request POST 'http://localhost:3000/register' \
--header 'Content-Type: application/ld+json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjU0Njc4NDE1LCJleHAiOjE2NTQ2ODU2MTV9.Ide29-ZulR-W11avaW3oa-6tRCDD3lGq1rQUOTqkE8k' \
--data-raw '{
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
                "gax:confirmationRequired": false,
                "gax:loggingMode": "gax:LoggingMandatory",
                "gax:circulationDetails": "Example text for the circulation details",
                "gax:permission": {
                    "@type": "gax:Permission",
                    "gax:assigner": "?providerDID",
                    "gax:target": "?AssetURI",
                    "gax:action": "gax:USE",
                    "gax:negotiable": false,
                    "gax:postDuty": {
                        "@type": "gax:Duty",
                        "gax:action": {
                            "@id": "gax:LOG"
                        }
                    }
                }
            }
        },
        "issuanceDate": "2021-01-23T12:21:23.876Z",
        "issuer": "did:provider:controller",
        "proof": {
            "type": "Ed25519Signature2018",
            "created": "2022-08-16T18:44:24Z",
            "verificationMethod": "did:provider:key:123",
            "proofPurpose": "assertionMethod",
            "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..OK5LRGOFDxHETGEPXvFWqoCM540egHyAPnrBi6pskyRIwdA9ZUf-U6aYsMYJduTNk9w6u98M18XU4Tn5S7rmBg"
        }
    }
    ]
}'
```

### Response

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
                    "gax:confirmationRequired": false,
                    "gax:loggingMode": "gax:LoggingMandatory",
                    "gax:circulationDetails": "Example text for the circulation details",
                    "gax:permission": {
                        "@type": "gax:Permission",
                        "gax:assigner": "?providerDID",
                        "gax:target": "?AssetURI",
                        "gax:action": "gax:USE",
                        "gax:negotiable": false,
                        "gax:postDuty": {
                            "@type": "gax:Duty",
                            "gax:action": {
                                "@id": "gax:LOG"
                            }
                        }
                    }
                }
            },
            "issuanceDate": "2021-01-23T12:21:23.876Z",
            "issuer": "did:provider:controller",
            "proof": [
                {
                    "type": "Ed25519Signature2018",
                    "created": "2022-08-16T18:44:24Z",
                    "verificationMethod": "did:provider:key:123",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..OK5LRGOFDxHETGEPXvFWqoCM540egHyAPnrBi6pskyRIwdA9ZUf-U6aYsMYJduTNk9w6u98M18XU4Tn5S7rmBg"
                }
            ]
        }
    ],
    "proof": {
        "type": "Ed25519Signature2018",
        "created": "2022-08-17T10:03:18Z",
        "verificationMethod": "did:dcs:key:123",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..872do_aYSTSytqRtbJbri0sKBbVnKhShzn5BSZaHHD59P6tUPtZeY0Ls002VJ96-alGLgGSdEn4c47Zz1TIMBA"
    }
}
```
