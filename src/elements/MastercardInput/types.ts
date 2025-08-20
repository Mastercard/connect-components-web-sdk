import BaseInputElement from '../BaseInputElement'

export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  BaseInputElement: typeof BaseInputElement,
  sleep: Function, 
  document: Document,
  window: Window,
  logger: Console
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
  generateIframeURL(formId: string, elementId: string): string,
}