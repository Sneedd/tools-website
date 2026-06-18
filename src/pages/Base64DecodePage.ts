import { Page } from "./Page";
import { decodeBase64 } from "../lib/base64";
import { decodeText, TextCharset } from "../lib/textEncoding";

export class Base64DecodePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-encoding-base64-decode") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const input = node.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
    const output = node.querySelector<HTMLTextAreaElement>('[data-role="output"]')!;
    const btnDecode = node.querySelector<HTMLButtonElement>('[data-role="btn-decode"]')!;
    const selectCharset = node.querySelector<HTMLSelectElement>('[data-role="select-charset"]')!;

    btnDecode.addEventListener("click", () => {
      try {
        const bytes = decodeBase64(input.value);
        output.value = decodeText(bytes, selectCharset.value as TextCharset);
      } catch (err) {
        output.value = `Error: ${(err as Error).message}`;
      }
    });

    container.replaceChildren(node);
  }
}

export const createBase64DecodePage = (): Page => new Base64DecodePage();
