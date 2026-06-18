import { Page } from "./Page";

const randomBytes = (size: number): Uint8Array => {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytes;
};

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");

const toBase64 = (bytes: Uint8Array): string =>
  btoa(Array.from(bytes).map((b) => String.fromCharCode(b)).join(""));

const toBase64Url = (bytes: Uint8Array): string =>
  toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export class UniqueRandomPage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-unique-random") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const result = node.querySelector<HTMLTextAreaElement>('[data-role="result"]')!;
    const btnAppend = node.querySelector<HTMLButtonElement>('[data-role="btn-append"]')!;
    const btnClear = node.querySelector<HTMLButtonElement>('[data-role="btn-clear"]')!;
    const rangeSize = node.querySelector<HTMLInputElement>('[data-role="range-size"]')!;
    const sizeValue = node.querySelector<HTMLElement>('[data-role="size-value"]')!;
    const radioBase64 = node.querySelector<HTMLInputElement>('[data-role="radio-base64"]')!;
    const radioBase64Url = node.querySelector<HTMLInputElement>('[data-role="radio-base64url"]')!;

    const updateSizeValue = () => sizeValue.textContent = rangeSize.value;
    rangeSize.addEventListener("input", updateSizeValue);
    updateSizeValue();

    const generate = (): string => {
      const bytes = randomBytes(parseInt(rangeSize.value, 10));
      if (radioBase64.checked) return toBase64(bytes);
      if (radioBase64Url.checked) return toBase64Url(bytes);
      return toHex(bytes);
    };

    btnAppend.addEventListener("click", () => result.value += generate() + "\r\n");
    btnClear.addEventListener("click", () => result.value = "");

    container.replaceChildren(node);
  }
}

export function createUniqueRandomPage(): Page {
  return new UniqueRandomPage();
}
