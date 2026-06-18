import { Router } from "../../router/Router";
import { MenuItem } from "../menu/MenuItem";

export class Navigation {

  private links = new Map<string, HTMLAnchorElement>();

  constructor(private container: HTMLElement, private menu: MenuItem[], private router: Router) {
    this.router.onRouteChange((path) => this.setActive(path));
  }

  render(): void {
    const links = document.createElement("div");
    links.className = "tools-nav-links";
    this.menu.forEach((item) => links.appendChild(this.buildEntry(item)));

    const footer = document.createElement("div");
    footer.className = "tools-nav-footer";
    footer.appendChild(document.createElement("hr"));
    const footerContent = document.createElement("div");
    footerContent.className = "tools-nav-footer-content";
    const label = document.createElement("span");
    label.textContent = "Tools";
    const version = document.createElement("code");
    version.textContent = "1.1.0";
    footerContent.append(label, version);
    footer.appendChild(footerContent);

    this.container.replaceChildren(links, footer);
    this.setActive(this.router.currentPath);
  }

  private buildEntry(item: MenuItem): Node {
    const template = document.getElementById("tpl-nav-entry") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const link = node.querySelector<HTMLAnchorElement>('[data-role="nav-link"]')!;
    const icon = node.querySelector<HTMLElement>('[data-role="nav-icon"]')!;
    const label = node.querySelector<HTMLElement>('[data-role="nav-label"]')!;
    const childrenContainer = node.querySelector<HTMLElement>('[data-role="nav-children"]')!;

    link.href = item.path;
    icon.classList.add("bi", item.icon);
    label.textContent = item.displayName;
    this.links.set(item.path, link);

    item.children?.forEach((child) => childrenContainer.appendChild(this.buildSubEntry(child)));

    return node;
  }

  private buildSubEntry(item: MenuItem): Node {
    const template = document.getElementById("tpl-nav-subentry") as HTMLTemplateElement;
    const node = template.content.cloneNode(true) as DocumentFragment;

    const link = node.querySelector<HTMLAnchorElement>('[data-role="nav-link"]')!;
    const icon = node.querySelector<HTMLElement>('[data-role="nav-icon"]')!;
    const label = node.querySelector<HTMLElement>('[data-role="nav-label"]')!;

    link.href = item.path;
    icon.classList.add("bi", item.icon);
    label.textContent = item.displayName;
    this.links.set(item.path, link);

    return node;
  }

  private setActive(path: string): void {
    this.links.forEach((link, linkPath) => link.classList.toggle("active", linkPath === path));
  }
}
