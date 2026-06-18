import { Page } from "./Page";

export class HomePage implements Page {

  render(container: HTMLElement): void {
    const template = document.getElementById("tpl-page-home") as HTMLTemplateElement;
    container.replaceChildren(template.content.cloneNode(true));
  }
}

export function createHomePage(): Page {
  return new HomePage();
}
