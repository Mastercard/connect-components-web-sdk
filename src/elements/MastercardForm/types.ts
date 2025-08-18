import EventStream from '../EventStream'
import {EventTypes} from '../../types'
export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  crypto: {
    randomUUID(): string,
  },
  HTMLElement: typeof HTMLElement,
  EventStream: typeof EventStream,
  MutationObserver: typeof MutationObserver,
  logger: Console,
  document: Document
}
export type EventMessage = {
  formId: string,
  eventType: EventTypes,
  requestId: string,
  eventStreamId?: string
}

export type ElementExports = {
  connectedCallback(): void,
  onSubmit(event: any): void,
  submit(): void
}
