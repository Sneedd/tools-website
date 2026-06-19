import { decodeBase64 } from "./base64";
import { decodeText } from "./textEncoding";

export interface JwtSegments {
  header: string;
  payload: string;
  signature: string;
}

export function splitJwt(token: string): JwtSegments {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts.some((p) => p.length === 0)) {
    throw new Error("Invalid JWT: expected 3 dot-separated segments");
  }
  const [header, payload, signature] = parts;
  return { header, payload, signature };
}

export function decodeJwtSegmentJson(segment: string): unknown {
  const bytes = decodeBase64(segment);
  const text = decodeText(bytes, "utf-8");
  return JSON.parse(text);
}

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatLocalDateTime(date: Date): string {
  const day = date.getDate();
  const month = MONTH_ABBR[date.getMonth()];
  const year = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${day}. ${month} ${year} ${hh}:${mm}:${ss}`;
}

const TIMESTAMP_CLAIMS = new Set(["exp", "iat", "nbf", "auth_time"]);
const CLAIM_LINE_RE = /^(\s*"(\w+)":\s*(-?\d+(?:\.\d+)?))(,?)\s*$/;

export function annotatePayloadTimestamps(prettyJson: string): string {
  return prettyJson
    .split("\n")
    .map((line) => {
      const match = line.match(CLAIM_LINE_RE);
      if (!match) return line;

      const [, prefix, claimName, numberText, trailingComma] = match;
      if (!TIMESTAMP_CLAIMS.has(claimName)) return line;

      const seconds = Number(numberText);
      if (!Number.isFinite(seconds)) return line;

      const formatted = formatLocalDateTime(new Date(seconds * 1000));
      return `${prefix}${trailingComma} // ${formatted}`;
    })
    .join("\n");
}
