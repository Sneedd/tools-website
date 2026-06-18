import CryptoJS from "crypto-js";
import { Page } from "./Page";

type Hasher = (text: string) => CryptoJS.lib.WordArray;

export class HashSinglePage implements Page {

  constructor(private title: string, private hash: Hasher) { }

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-hash-single") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    node.querySelector('[data-role="title"]')!.textContent = this.title;

    const input = node.querySelector<HTMLInputElement>('[data-role="input-text"]')!;
    const outputs = {
      hex: node.querySelector<HTMLInputElement>('[data-role="out-hex"]')!,
      base64: node.querySelector<HTMLInputElement>('[data-role="out-b64"]')!,
      base64Url: node.querySelector<HTMLInputElement>('[data-role="out-b64url"]')!,
    };

    const recompute = () => {
      const hash = this.hash(input.value);
      outputs.hex.value = hash.toString();
      outputs.base64.value = hash.toString(CryptoJS.enc.Base64);
      outputs.base64Url.value = hash.toString(CryptoJS.enc.Base64url);
    };

    input.addEventListener("input", recompute);
    recompute();

    container.replaceChildren(node);
  }
}

export const createMd5Page = (): Page => new HashSinglePage("MD5", CryptoJS.MD5);
export const createSha1Page = (): Page => new HashSinglePage("SHA-1", CryptoJS.SHA1);
export const createSha224Page = (): Page => new HashSinglePage("SHA-224", CryptoJS.SHA224);
export const createSha256Page = (): Page => new HashSinglePage("SHA-256", CryptoJS.SHA256);
export const createSha384Page = (): Page => new HashSinglePage("SHA-384", CryptoJS.SHA384);
export const createSha512Page = (): Page => new HashSinglePage("SHA-512", CryptoJS.SHA512);
export const createSha3Page = (): Page => new HashSinglePage("SHA-3", CryptoJS.SHA3);
