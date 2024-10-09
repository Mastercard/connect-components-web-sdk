export type ElementImports = {
  HTMLElement: any,
  MastercardEventEmitter: import('../../core/MastercardEventEmitter/types').MastercardEventEmitter,
  document: any,
  window: any,
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
  addEventListener(eventName: string, callback: Function): void,
  removeEventListener(eventName: string, callback: Function): void,
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void,
  generateOuterStyle(generatedStyle: any, target: any): void,
  generateBaseStyle(mockElement: any): StyleObject,
}