export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  crypto: {
    randomUUID(): string,
  },
  HTMLElement: any,
  document: any,
  MutationObserver: any,
  logger: {
    log: Function,
    warn: Function,
    error: Function,
  }
}

export type ElementExports = {
  connectedCallback(): void,
  onSubmit(event: any): void,
  submit(): void
}
