# Developer Tools (web)

Tools every developer needs, without the typical nonsense.
Working only in the browser, no entered information is ever send over the line.
Example: <https://tools.steffenott.net/>

## Features

- **Hash Functions** — MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-3
- **Json Web Tokens** — JWT analyser (decode header/payload/signature, optionally verify against the issuer's public OIDC discovery + JWKS endpoints — this requests the issuer's public keys, it never sends the token or any entered data), JWK generator (RSA/ECDSA key pairs)
- **Password** — Pronounceable password generator
- **Unique Values** — Random values, UUID v1, UUID v4, UUID analyser
- **Encoding** — Base64 encode/decode, URL encode/decode

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # preview the production build
```

## License

MIT — see [LICENSE](LICENSE).
