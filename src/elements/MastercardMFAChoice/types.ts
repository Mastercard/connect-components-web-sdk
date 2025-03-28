export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  BaseInputElement: any,
  sleep: Function,
  document: any,
  window: any,
  logger: any,
  MastercardEventEmitter: import('../../core/MastercardEventEmitter/types').MastercardEventEmitter,
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
  render(): void,
  generateIframeURL(formId: string, elementId: string): string,
}