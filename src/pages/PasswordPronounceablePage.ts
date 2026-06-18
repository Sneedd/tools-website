import { Page } from "./Page";

export class PasswordPronounceablePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-password-pronounceable") as HTMLTemplateElement;
    container.replaceChildren(template.content.cloneNode(true));
  }
}

export function createPasswordPronounceablePage(): Page {
  return new PasswordPronounceablePage();
}
