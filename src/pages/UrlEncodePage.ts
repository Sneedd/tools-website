import { Page } from "./Page";

export class UrlEncodePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-encoding-url-encode") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const input = node.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
    const output = node.querySelector<HTMLTextAreaElement>('[data-role="output"]')!;
    const btnEncode = node.querySelector<HTMLButtonElement>('[data-role="btn-encode"]')!;

    btnEncode.addEventListener("click", () => output.value = encodeURIComponent(input.value));

    container.replaceChildren(node);
  }
}

export const createUrlEncodePage = (): Page => new UrlEncodePage();
