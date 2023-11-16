export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  HTMLElement: any,
  MastercardEventEmitter: import('../../core/MastercardEventEmitter/types').MastercardEventEmitter,
  sleep: Function,
  document: any,
  window: any,
  logger: any
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
  constructor(): any,
  observedAttributes(): Array<string>,
  render(): void,
  connectedCallback(): void,
  mergeStyle(newStyle: any): void,
  setStyle(newStyle: any): Promise<void>,
  generateAutoStyleObject(): StyleObject,
  attributeChangedCallback(name: string): void,
  generateStyleString(styleObject: StyleObject): string,
  generateStyleObject(newStyle: StyleObject): StyleObject,
  generateOuterStyle(generatedStyle: any, target: any): void
}