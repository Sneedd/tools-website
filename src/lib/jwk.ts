export type RsaModulusLength = 2048 | 3072 | 4096;
export type EcNamedCurve = "P-256" | "P-384" | "P-521";

export interface JwkPair {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

async function exportKeyPair(keyPair: CryptoKeyPair): Promise<JwkPair> {
  const [publicKey, privateKey] = await Promise.all([
    crypto.subtle.exportKey("jwk", keyPair.publicKey),
    crypto.subtle.exportKey("jwk", keyPair.privateKey),
  ]);
  return { publicKey, privateKey };
}

export async function generateRsaJwkPair(modulusLength: RsaModulusLength): Promise<JwkPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  return exportKeyPair(keyPair);
}

export async function generateEcdsaJwkPair(namedCurve: EcNamedCurve): Promise<JwkPair> {
  const keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve }, true, ["sign", "verify"]);
  return exportKeyPair(keyPair);
}
