
export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  HTMLElement: typeof HTMLElement,
  document: any,
  window: any,
  logger: {
    log: (...args: any[]) => void,
    warn: (...args: any[]) => void,
    error: (...args: any[]) => void,
  }
}

export interface MastercardEventStreamInterface {
  connectedCallback(): void,
  addEventListener(eventName: string, callback: EventListenerOrEventListenerObject): void,
  removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject): void,
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void,
  _bindFrameSource(): void,
  _registerEventListener(): void
}

export interface MastercardEventStreamStatic {
  new(...args: any[]): any
  observedAttributes: Array<string>,
}