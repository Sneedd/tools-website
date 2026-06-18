const STANDARD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const URL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export type Base64Variant = "standard" | "url";

export function encodeBase64(bytes: Uint8Array, variant: Base64Variant): string {
  const chars = variant === "url" ? URL_CHARS : STANDARD_CHARS;
  let result = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    const triplet = (b0 << 16) | ((b1 ?? 0) << 8) | (b2 ?? 0);

    result += chars[(triplet >> 18) & 63];
    result += chars[(triplet >> 12) & 63];
    result += i + 1 < bytes.length ? chars[(triplet >> 6) & 63] : (variant === "standard" ? "=" : "");
    result += i + 2 < bytes.length ? chars[triplet & 63] : (variant === "standard" ? "=" : "");
  }

  return result;
}

const DECODE_MAP = new Map<string, number>();
for (let i = 0; i < STANDARD_CHARS.length; i++) {
  DECODE_MAP.set(STANDARD_CHARS[i], i);
  DECODE_MAP.set(URL_CHARS[i], i);
}

export function decodeBase64(input: string): Uint8Array {
  const clean = input.replace(/[\s=]+/g, "");

  const values: number[] = [];
  for (const ch of clean) {
    const value = DECODE_MAP.get(ch);
    if (value === undefined) throw new Error(`Invalid Base64 character: "${ch}"`);
    values.push(value);
  }
  if (values.length % 4 === 1) throw new Error("Invalid Base64 input length.");

  const bytes: number[] = [];
  for (let i = 0; i < values.length; i += 4) {
    const v0 = values[i];
    const v1 = values[i + 1] ?? 0;
    const v2 = values[i + 2];
    const v3 = values[i + 3];
    const bits = (v0 << 18) | (v1 << 12) | ((v2 ?? 0) << 6) | (v3 ?? 0);

    bytes.push((bits >> 16) & 0xff);
    if (v2 !== undefined) bytes.push((bits >> 8) & 0xff);
    if (v3 !== undefined) bytes.push(bits & 0xff);
  }

  return new Uint8Array(bytes);
}
