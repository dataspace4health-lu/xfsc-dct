# Contract Validation

## Request

### Header

Must have `Content-Type` specified as `application/ld+json`.

### Body

A valid Data Asset Self-Description as JSON-LD.

## Response

JSON

## Example

### Request

```
curl --location --request POST 'http://localhost:3000/validate' \
--header 'Content-Type: application/ld+json' \
--header 'Authorization: Bearer axcvbxcvbxcvbxcvbxcvbxcvbxcvbxcvbxcvbxcvb' \
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
    "isValid": true
}
```

#### Success 200 but invalid contract

```
{
    "isValid": false,
    "errorMessage": "Unauthorized – invalid provider signature"
}
```
