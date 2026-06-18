export interface Page {
  render(container: HTMLElement): void;
  destroy?(): void;
}

export type PageFactory = () => Page;
