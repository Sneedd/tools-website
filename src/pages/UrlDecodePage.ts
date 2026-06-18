import { Page } from "./Page";

export class UrlDecodePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-encoding-url-decode") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const input = node.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
    const output = node.querySelector<HTMLTextAreaElement>('[data-role="output"]')!;
    const btnDecode = node.querySelector<HTMLButtonElement>('[data-role="btn-decode"]')!;

    btnDecode.addEventListener("click", () => {
      try {
        output.value = decodeURIComponent(input.value);
      } catch (err) {
        output.value = `Error: ${(err as Error).message}`;
      }
    });

    container.replaceChildren(node);
  }
}

export const createUrlDecodePage = (): Page => new UrlDecodePage();
