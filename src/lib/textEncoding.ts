export type TextCharset = "utf-8" | "windows-1252" | "iso-8859-1";

const WINDOWS_1252_HIGH: Record<number, number> = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160,
  0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153,
  0x9e: 0x017e, 0x9f: 0x0178,
};

const WINDOWS_1252_ENCODE = new Map<number, number>(
  Object.entries(WINDOWS_1252_HIGH).map(([byte, codePoint]) => [codePoint, Number(byte)])
);

function encodeChar(codePoint: number, charset: TextCharset): number {
  if (codePoint < 0x80) return codePoint;
  if (charset === "iso-8859-1") return codePoint <= 0xff ? codePoint : 0x3f;
  if (codePoint >= 0xa0 && codePoint <= 0xff) return codePoint;
  return WINDOWS_1252_ENCODE.get(codePoint) ?? 0x3f;
}

export function encodeText(text: string, charset: TextCharset): Uint8Array {
  if (charset === "utf-8") return new TextEncoder().encode(text);

  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    bytes[i] = encodeChar(text.charCodeAt(i), charset);
  }
  return bytes;
}

export function decodeText(bytes: Uint8Array, charset: TextCharset): string {
  if (charset === "utf-8") return new TextDecoder("utf-8").decode(bytes);
  if (charset === "windows-1252") return new TextDecoder("windows-1252").decode(bytes);
  return Array.from(bytes, (b) => String.fromCharCode(b)).join("");
}
