export type Jwk = JsonWebKey & { kid?: string };

export interface AlgMapping {
  importParams: RsaHashedImportParams | EcKeyImportParams;
  verifyParams: AlgorithmIdentifier | RsaPssParams | EcdsaParams;
}

const HASH_BYTE_LENGTH: Record<string, number> = { "SHA-256": 32, "SHA-384": 48, "SHA-512": 64 };

export function mapJwtAlgToWebCrypto(alg: string): AlgMapping | undefined {
  switch (alg) {
    case "RS256":
    case "RS384":
    case "RS512": {
      const hash = `SHA-${alg.slice(2)}`;
      return {
        importParams: { name: "RSASSA-PKCS1-v1_5", hash },
        verifyParams: { name: "RSASSA-PKCS1-v1_5" },
      };
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      const hash = `SHA-${alg.slice(2)}`;
      return {
        importParams: { name: "RSA-PSS", hash },
        verifyParams: { name: "RSA-PSS", saltLength: HASH_BYTE_LENGTH[hash] },
      };
    }
    case "ES256":
      return { importParams: { name: "ECDSA", namedCurve: "P-256" }, verifyParams: { name: "ECDSA", hash: "SHA-256" } };
    case "ES384":
      return { importParams: { name: "ECDSA", namedCurve: "P-384" }, verifyParams: { name: "ECDSA", hash: "SHA-384" } };
    case "ES512":
      return { importParams: { name: "ECDSA", namedCurve: "P-521" }, verifyParams: { name: "ECDSA", hash: "SHA-512" } };
    default:
      return undefined;
  }
}

export interface DiscoveryResult {
  jwksUri: string;
}

export async function fetchOidcDiscovery(issuer: string): Promise<DiscoveryResult> {
  const url = `${issuer.replace(/\/+$/, "")}/.well-known/openid-configuration`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error(`Network error fetching discovery document from ${url} (CORS or connectivity issue)`);
  }
  if (!response.ok) {
    throw new Error(`Discovery endpoint returned HTTP ${response.status} for ${url}`);
  }

  let doc: unknown;
  try {
    doc = await response.json();
  } catch {
    throw new Error(`Discovery document at ${url} is not valid JSON`);
  }

  const jwksUri = (doc as Record<string, unknown>)?.jwks_uri;
  if (typeof jwksUri !== "string" || !jwksUri) {
    throw new Error("Discovery document is missing 'jwks_uri'");
  }
  return { jwksUri };
}

export interface Jwks {
  keys: Jwk[];
}

export async function fetchJwks(jwksUri: string): Promise<Jwks> {
  let response: Response;
  try {
    response = await fetch(jwksUri);
  } catch {
    throw new Error(`Network error fetching JWKS from ${jwksUri} (CORS or connectivity issue)`);
  }
  if (!response.ok) {
    throw new Error(`JWKS endpoint returned HTTP ${response.status} for ${jwksUri}`);
  }

  let doc: unknown;
  try {
    doc = await response.json();
  } catch {
    throw new Error(`JWKS document at ${jwksUri} is not valid JSON`);
  }

  const keys = (doc as Record<string, unknown>)?.keys;
  if (!Array.isArray(keys)) {
    throw new Error("JWKS document is missing a 'keys' array");
  }
  return { keys };
}

export function findMatchingJwk(keys: Jwk[], kid: string | undefined): Jwk {
  if (kid) {
    const match = keys.find((k) => k.kid === kid);
    if (!match) throw new Error(`Key with kid '${kid}' not found in JWKS`);
    return match;
  }
  if (keys.length === 0) throw new Error("JWKS contains no keys");
  if (keys.length > 1) throw new Error("Ambiguous key: multiple keys in JWKS and no kid in token header");
  return keys[0];
}

export async function verifyJwtSignature(
  alg: string,
  jwk: JsonWebKey,
  signedInput: Uint8Array,
  signatureBytes: Uint8Array
): Promise<boolean> {
  const mapping = mapJwtAlgToWebCrypto(alg);
  if (!mapping) throw new Error(`Unsupported algorithm: ${alg}`);

  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey("jwk", jwk, mapping.importParams, false, ["verify"]);
  } catch (err) {
    throw new Error(`Failed to import key: ${(err as Error).message}`);
  }

  return crypto.subtle.verify(mapping.verifyParams, key, signatureBytes, signedInput);
}
