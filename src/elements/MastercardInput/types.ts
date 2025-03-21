export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  BaseInputElement: any,
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
  observedAttributes: Array<string>,
  render(): void,
  connectedCallback(): void,
  attributeChangedCallback(name: string): void,
  generateAutoStyleObject(): StyleObject,
  generateStyleObject(newStyle: StyleObject): StyleObject,
}