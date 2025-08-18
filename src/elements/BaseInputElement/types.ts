import Sleep from '../../core/Sleep'
import {AppConfig} from '../../config/types'
import {MastercardEventEmitter} from '../../core';

export type ElementImports = {
  HTMLElement: typeof HTMLElement,
  MastercardEventEmitter: typeof MastercardEventEmitter,
  document: Document,
  window: Window,
  appConfig: AppConfig,
  logger: Console,
  sleep: typeof Sleep
}

export interface BaseInput {
  connectedCallback(): void,
  addEventListener(eventName: string, callback: EventListenerOrEventListenerObject): void,
  removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject): void,
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void,
  render(): void,
}

export interface BaseInputStatic {
  new(...args: any[]): any
  observedAttributes: Array<string>,
}

export type StyleUpdateEvent = {
  eventType: 'updateStyle',
  data: string
}

enum WindowEvents {
  InputReady = 'inputReady',
  InputBlur = 'inputBlur',
  InputFocus = 'inputFocus',
}

export type WindowEvent = {
  origin: string,
  data: {
    eventType: WindowEvents,
    elementId: string
  }
}

// not used?
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