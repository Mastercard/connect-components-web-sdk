export type ElementImports = {
  HTMLElement: any,
  MastercardEventEmitter: import('../../core/MastercardEventEmitter/types').MastercardEventEmitter,
  document: any,
  window: any,
  appConfig: any,
  logger: any,
  sleep: any
}

export type StyleObject = {
  overflow?: string,
  margin?: string,
  height?: string,
  width?: string,
  backgroundColor?: string,
  border?: string,
  borderWidth?: string,
  borderRadius?: string,
  borderColor?: string,
  display?: string,
  color?: string,
  fontFamily?: string,
  fontSize?: string,
  fontWeight?: string,
  letterSpacing?: string,
  paddingTop?: string,
  paddingLeft?: string,
  paddingRight?: string,
  paddingBottom?: string,
}

export type ElementExports = {
  observedAttributes: Array<string>,
  connectedCallback(): void,
  addEventListener(eventName: string, callback: Function): void,
  removeEventListener(eventName: string, callback: Function): void,
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void,
  render(): void,
}