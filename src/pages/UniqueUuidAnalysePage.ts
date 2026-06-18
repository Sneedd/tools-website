import { version as uuidVersion, validate as uuidValidate } from 'uuid';
import { Page } from "./Page";

const uuidToDate = (id: string): Date => {
  const arr = id.split('-');
  const timeText = [arr[2].substring(1), arr[1], arr[0]].join('');
  const time = parseInt(timeText, 16) - 122192928000000000;
  return new Date(Math.floor(time / 10000));
};

const validateUuid = (id: string): string => {
  if (!uuidValidate(id)) {
    return "Not a valid UUID";
  }
  const version = uuidVersion(id);
  if (version === 1) {
    return `UUID Version: ${version}\r\nDateTime: ${uuidToDate(id)}`;
  }
  return `UUID Version: ${version}`;
};

export class UniqueUuidAnalysePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-unique-uuid-analyse") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const input = node.querySelector<HTMLInputElement>('[data-role="input-validate"]')!;
    const output = node.querySelector<HTMLTextAreaElement>('[data-role="out-validate"]')!;

    input.addEventListener("input", () => output.value = validateUuid(input.value));
    output.value = validateUuid("");

    container.replaceChildren(node);
  }
}

export function createUuidAnalysePage(): Page {
  return new UniqueUuidAnalysePage();
}
