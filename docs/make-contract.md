# Data Asset Make Contract

## Description

Making finalized Agreements based on an available Data Asset Self-Description. On success, it returns a finalized Agreement (i.e., a mutually signed Data Contract).

## Request

### Header

Must have `Content-Type` specified as `application/ld+json`.

### Body

A valid Data Asset Self-Description as JSON-LD.

## Response

Error-checked for `Only non-negotiable check` and `no confirmation requirement`, and validated Data Asset Self-Description (as JSON-LD) signed by GX-DCS.

## Example

### Request

```
curl --location --request POST 'http://localhost:3000/make/contract' \
--header 'Content-Type: application/ld+json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjU0Njc4NDE1LCJleHAiOjE2NTQ2ODU2MTV9.Ide29-ZulR-W11avaW3oa-6tRCDD3lGq1rQUOTqkE8k' \
--data-raw '{
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "type": "VerifiablePresentation",
    "VerifiableCredential": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1"
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
                "gax:publisher": "?publisherDID",
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
                        "gax:negotiable": true,
                        "gax:postDuty": {
                            "@type": "gax:Duty",
                            "gax:action": {
                                "@id": "gax:LOG"
                            }
                        }
                    }
                }
            }
        }
    ],
    "proof": [
        {
            "type": "Ed25519Signature2018",
            "proofPurpose": "assertionMethod",
            "created": "2019-08-23T20:21:34Z",
            "verificationMethod": "did:provider:123456#key1",
            "jws": "eyJ0eXAiOiJK...gFWFOEjXk"
        }
    ]
}'
```

### Response

```
{
    "@context": "https://www.w3.org/2018/credentials/v1",
    "type": "VerifiablePresentation",
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "assertionMethod",
        "created": "2022-07-11T14:01:06.978Z",
        "verificationMethod": "did:DCS:123456#key2",
        "jws": "eyJ0eXAiOiJK...gFWFOEjXk"
    },
    "VerifiableCredential": {
        "credentialSubject": {
            "id": "http://example.org/data-asset-1",
            "type": "gax:DataAsset",
            "gax:category": "example",
            "gax:containsPersonalData": false,
            "gax:contractOffer": {
                "type": "gax-GX-DCS:contractOffer",
                "gax:choiceOfLaw": "iso:Germany",
                "gax:circulationDetails": "Example text for the circulation details",
                "gax:confirmationRequired": false,
                "gax:generalTerms": "Example text for the general terms",
                "gax:loggingMode": "gax:LoggingMandatory",
                "gax:permission": {
                    "type": "gax:Permission",
                    "gax:action": "gax:USE",
                    "gax:assigner": "?providerDID",
                    "gax:negotiable": false,
                    "gax:postDuty": {
                        "type": "gax:Duty",
                        "gax:action": {
                            "id": "gax:LOG"
                        }
                    },
                    "gax:target": "?AssetURI"
                }
            },
            "gax:created": "2021-01-23T12:21:23.876Z",
            "gax:creator": "?creatorDID",
            "gax:description": "Example description",
            "gax:distribution": {
                "gax:accessURL": "www.example.com/data/example.csv",
                "gax:byteSize": "100000",
                "gax:created": "2021-01-23T18:25:43.511Z",
                "gax:description": "Example distribution description",
                "gax:mediaType": "text/csv",
                "gax:modified": "2021-01-25T12:20:34.007Z",
                "gax:title": "Example distribution title"
            },
            "gax:keyword": [
                "key",
                "word"
            ],
            "gax:language": "http://id.loc.gov/vocabulary/iso639-1/en",
            "gax:modified": "2021-01-24T14:45:03.517Z",
            "gax:publisher": "?publisherDID",
            "gax:sampleAvailable": false,
            "gax:title": "Example title"
        }
    }
}
```
