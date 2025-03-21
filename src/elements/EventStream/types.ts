
export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  HTMLElement: any,
  document: any,
  window: any,
  logger: {
    log: Function,
    warn: Function,
    error: Function,
  }
}
export type ElementExports = {
  observedAttributes(): Array<string>,
  connectedCallback(): void,
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void,
  _bindFrameSource(): void,
  _registerEventListener(): void,
  _isValidEventStreamId(id: string): boolean,
};