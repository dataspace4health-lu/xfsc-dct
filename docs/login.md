# Login
Returns a JWT token on success.

## Request URL params
  * ```username```
  * ```password```

## Response
```javascript
{
  "accessToken": "(jws token)",
  "expiresAt": "(unix timestamp)"
}
```

## Example
### Request: 
```
curl --location --request POST 'http://localhost:3000/auth/login?username=admin&password=admin' --header 'Content-Type: application/ld+json' --data-raw ''
```

### Response
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjU0Nzc0MDIzLCJleHAiOjE2NTQ3ODEyMjN9.ljxnMx-M8T6gy4f3hDH1_gJ21AGUN6zrVsq_oojBIF4",
  "expiresAt": 1654781223
}
```