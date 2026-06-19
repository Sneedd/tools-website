import { Page } from "./Page";
import { annotatePayloadTimestamps, decodeJwtSegmentJson, JwtSegments, splitJwt } from "../lib/jwt";
import {
  fetchJwks,
  fetchOidcDiscovery,
  findMatchingJwk,
  mapJwtAlgToWebCrypto,
  verifyJwtSignature,
} from "../lib/jwtVerify";
import { decodeBase64 } from "../lib/base64";

function decodeJsonObject(segment: string): Record<string, unknown> {
  const value = decodeJwtSegmentJson(segment);
  if (typeof value !== "object" || value === null) {
    throw new Error("not a JSON object");
  }
  return value as Record<string, unknown>;
}

export class JwtAnalysePage implements Page {

  private segments: JwtSegments | undefined;
  private headerObj: Record<string, unknown> | undefined;
  private payloadObj: Record<string, unknown> | undefined;

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-jwt-analyse") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const input = node.querySelector<HTMLTextAreaElement>('[data-role="input-token"]')!;
    const outHeader = node.querySelector<HTMLElement>('[data-role="out-header"]')!;
    const outPayload = node.querySelector<HTMLElement>('[data-role="out-payload"]')!;
    const outSignature = node.querySelector<HTMLElement>('[data-role="out-signature"]')!;
    const btnVerify = node.querySelector<HTMLButtonElement>('[data-role="btn-verify"]')!;
    const outVerifyStatus = node.querySelector<HTMLElement>('[data-role="out-verify-status"]')!;
    const linkDiscovery = node.querySelector<HTMLAnchorElement>('[data-role="link-discovery"]')!;
    const linkJwks = node.querySelector<HTMLAnchorElement>('[data-role="link-jwks"]')!;

    const recompute = () => {
      this.segments = undefined;
      this.headerObj = undefined;
      this.payloadObj = undefined;
      linkDiscovery.hidden = true;
      linkJwks.hidden = true;
      outVerifyStatus.textContent = "";

      let segments: JwtSegments;
      try {
        segments = splitJwt(input.value);
      } catch (err) {
        const message = (err as Error).message;
        outHeader.textContent = message;
        outPayload.textContent = message;
        outSignature.textContent = message;
        return;
      }
      this.segments = segments;

      try {
        const headerObj = decodeJsonObject(segments.header);
        this.headerObj = headerObj;
        outHeader.textContent = JSON.stringify(headerObj, null, 2);
      } catch (err) {
        outHeader.textContent = `Invalid Header: ${(err as Error).message}`;
      }

      try {
        const payloadObj = decodeJsonObject(segments.payload);
        this.payloadObj = payloadObj;
        outPayload.textContent = annotatePayloadTimestamps(JSON.stringify(payloadObj, null, 2));
      } catch (err) {
        outPayload.textContent = `Invalid Payload: ${(err as Error).message}`;
      }

      outSignature.textContent = segments.signature;

      const iss = this.payloadObj?.iss;
      if (typeof iss === "string" && iss) {
        const url = `${iss.replace(/\/+$/, "")}/.well-known/openid-configuration`;
        linkDiscovery.href = url;
        linkDiscovery.textContent = url;
        linkDiscovery.hidden = false;
      }
    };

    input.addEventListener("input", recompute);
    recompute();

    btnVerify.addEventListener("click", () => {
      void this.handleVerify(btnVerify, outVerifyStatus, linkJwks);
    });

    container.replaceChildren(node);
  }

  private async handleVerify(
    btnVerify: HTMLButtonElement,
    outVerifyStatus: HTMLElement,
    linkJwks: HTMLAnchorElement
  ): Promise<void> {
    const segments = this.segments;
    const headerObj = this.headerObj;
    const payloadObj = this.payloadObj;

    if (!segments || !headerObj || !payloadObj) {
      outVerifyStatus.textContent = "Cannot verify: paste a valid JWT first";
      return;
    }

    const alg = headerObj.alg;
    if (typeof alg !== "string") {
      outVerifyStatus.textContent = "Cannot verify: header has no 'alg' claim";
      return;
    }

    if (!mapJwtAlgToWebCrypto(alg)) {
      outVerifyStatus.textContent = `⚠️ Cannot verify: unsupported or symmetric algorithm (${alg})`;
      return;
    }

    const iss = payloadObj.iss;
    if (typeof iss !== "string" || !iss) {
      outVerifyStatus.textContent = "⚠️ No 'iss' claim in payload";
      return;
    }

    btnVerify.disabled = true;
    outVerifyStatus.textContent = "Verifying...";
    try {
      const discovery = await fetchOidcDiscovery(iss);
      linkJwks.href = discovery.jwksUri;
      linkJwks.textContent = discovery.jwksUri;
      linkJwks.hidden = false;

      const jwks = await fetchJwks(discovery.jwksUri);
      const kid = typeof headerObj.kid === "string" ? headerObj.kid : undefined;
      const matchedJwk = findMatchingJwk(jwks.keys, kid);

      const signedInput = new TextEncoder().encode(`${segments.header}.${segments.payload}`);
      const signatureBytes = decodeBase64(segments.signature);

      const valid = await verifyJwtSignature(alg, matchedJwk, signedInput, signatureBytes);
      outVerifyStatus.textContent = valid ? "✅ Signature valid" : "❌ Signature invalid";
    } catch (err) {
      outVerifyStatus.textContent = `❌ ${(err as Error).message}`;
    } finally {
      btnVerify.disabled = false;
    }
  }
}

export const createJwtAnalysePage = (): Page => new JwtAnalysePage();
