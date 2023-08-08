export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  HTMLElement: any,
}

export type ElementExports = {
  constructor(): any,
  observedAttributes(): Array<string>,
  render(): void,
  connectedCallback(): void,
  generateStyleString(): void,
  attributeChangedCallback(name: string): void,
}