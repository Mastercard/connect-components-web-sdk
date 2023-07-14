
export type ElementImports = {
  appConfig: import('../../config/app.config').AppConfig,
  HTMLElement: any,
}
export type ElementExports = {
  constructor(): any,
  observedAttributes(): Array<string>,
  connectedCallback(): void,
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void,
  _bindFrameSource(): void,
  _registerEventListener(): void,
  _isValidEventStreamId(id: string): boolean,
};