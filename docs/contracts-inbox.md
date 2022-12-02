# Data Asset DELS Inbox Descovery - Contracts

## Description

The main communication interface of given GX-DELS is based on the mechanics of Linked Data Notification
(LDN, see: https://www.w3.org/TR/ldn/) and so it is heavily based on HTTP.

## Request

### Header

Must have `Content-Type` specified as `application/ld+json`.

### Body

None

## Response

## Example

### Request

### Response GET

```
{
    "@context": "https://www.w3.org/ns/ldp",
    "@id": "https://dcs.gaia-x.com/contracts/1001",
    "inbox": "https://dels.gaia-x.com/inbox/",
    "link": "https://dels.gaia-x.com/inbox/",
    "rel": "http://www.w3.org/ns/ldp#inbox"
}
```
