import { v1 as uuidV1, v4 as uuidV4 } from 'uuid';
import { Page } from "./Page";

type UuidGenerator = () => string;

export class UniqueUuidCreatePage implements Page {

  constructor(private title: string, private generate: UuidGenerator) { }

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-unique-uuid-create") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    node.querySelector('[data-role="title"]')!.textContent = this.title;

    const result = node.querySelector<HTMLTextAreaElement>('[data-role="result"]')!;
    const btnCreate = node.querySelector<HTMLButtonElement>('[data-role="btn-create"]')!;
    const btnClear = node.querySelector<HTMLButtonElement>('[data-role="btn-clear"]')!;

    btnCreate.addEventListener("click", () => result.value += this.generate() + "\r\n");
    btnClear.addEventListener("click", () => result.value = "");

    container.replaceChildren(node);
  }
}

export const createUuidV1Page = (): Page => new UniqueUuidCreatePage("UUID v1", uuidV1);
export const createUuidV4Page = (): Page => new UniqueUuidCreatePage("UUID v4", uuidV4);
