import { Page, PageFactory } from "../pages/Page";

export interface RouteDefinition {
  path: string;
  factory: PageFactory;
}

export type RouteChangeListener = (path: string) => void;

export class Router {

  private routes = new Map<string, PageFactory>();
  private listeners: RouteChangeListener[] = [];
  private currentPage?: Page;
  private activePath = "";

  constructor(private container: HTMLElement) {
    window.addEventListener("popstate", () => this.renderRoute(location.pathname));
    document.addEventListener("click", (event) => this.handleClick(event));
  }

  get currentPath(): string {
    return this.activePath;
  }

  addRoutes(routes: RouteDefinition[]): void {
    routes.forEach((route) => this.routes.set(route.path, route.factory));
  }

  navigate(path: string, opts?: { replace?: boolean }): void {
    if (path === this.activePath) {
      return;
    }
    if (opts?.replace) {
      history.replaceState({}, "", path);
    } else {
      history.pushState({}, "", path);
    }
    this.renderRoute(path);
  }

  onRouteChange(listener: RouteChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  start(): void {
    this.renderRoute(location.pathname);
  }

  private handleClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const anchor = (event.target as HTMLElement)?.closest("a");
    if (!anchor || anchor.target || anchor.hasAttribute("download")) {
      return;
    }
    if (anchor.origin !== location.origin) {
      return;
    }

    event.preventDefault();
    this.navigate(anchor.pathname);
  }

  private renderRoute(path: string): void {
    const factory = this.routes.get(path);

    this.currentPage?.destroy?.();
    this.currentPage = undefined;

    if (factory) {
      this.currentPage = factory();
      this.currentPage.render(this.container);
    } else {
      this.container.replaceChildren();
    }

    this.activePath = path;
    this.listeners.forEach((listener) => listener(path));
  }
}
