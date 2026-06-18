import { Page } from "./Page";
import { generatePronounceablePassword } from "../lib/passwordPronounceable";

export class PasswordPronounceablePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-password-pronounceable") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const result = node.querySelector<HTMLTextAreaElement>('[data-role="result"]')!;
    const btnCreate = node.querySelector<HTMLButtonElement>('[data-role="btn-create"]')!;
    const btnClear = node.querySelector<HTMLButtonElement>('[data-role="btn-clear"]')!;
    const rangeLength = node.querySelector<HTMLInputElement>('[data-role="range-length"]')!;
    const lengthValue = node.querySelector<HTMLElement>('[data-role="length-value"]')!;
    const checkboxNumbers = node.querySelector<HTMLInputElement>('[data-role="checkbox-numbers"]')!;
    const checkboxNormalSpecial = node.querySelector<HTMLInputElement>('[data-role="checkbox-normal-special"]')!;
    const checkboxSpecial = node.querySelector<HTMLInputElement>('[data-role="checkbox-special"]')!;
    const checkboxExtraSpecial = node.querySelector<HTMLInputElement>('[data-role="checkbox-extra-special"]')!;

    const updateLengthValue = () => lengthValue.textContent = rangeLength.value;
    rangeLength.addEventListener("input", updateLengthValue);
    updateLengthValue();

    const generate = (): string => generatePronounceablePassword({
      length: parseInt(rangeLength.value, 10),
      includeNumbers: checkboxNumbers.checked,
      includeNormalSpecial: checkboxNormalSpecial.checked,
      includeSpecial: checkboxSpecial.checked,
      includeExtraSpecial: checkboxExtraSpecial.checked,
    });

    btnCreate.addEventListener("click", () => result.value += generate() + "\r\n");
    btnClear.addEventListener("click", () => result.value = "");

    container.replaceChildren(node);
  }
}

export function createPasswordPronounceablePage(): Page {
  return new PasswordPronounceablePage();
}
