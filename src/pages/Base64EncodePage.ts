import { Page } from "./Page";
import { Base64Variant, encodeBase64 } from "../lib/base64";
import { encodeText, TextCharset } from "../lib/textEncoding";

export class Base64EncodePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-encoding-base64-encode") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const input = node.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
    const output = node.querySelector<HTMLTextAreaElement>('[data-role="output"]')!;
    const btnEncode = node.querySelector<HTMLButtonElement>('[data-role="btn-encode"]')!;
    const radioStandard = node.querySelector<HTMLInputElement>('[data-role="radio-standard"]')!;
    const selectCharset = node.querySelector<HTMLSelectElement>('[data-role="select-charset"]')!;

    btnEncode.addEventListener("click", () => {
      const variant: Base64Variant = radioStandard.checked ? "standard" : "url";
      const bytes = encodeText(input.value, selectCharset.value as TextCharset);
      output.value = encodeBase64(bytes, variant);
    });

    container.replaceChildren(node);
  }
}

export const createBase64EncodePage = (): Page => new Base64EncodePage();
