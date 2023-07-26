export type ElementImports = {
  appConfig: import('../../config/types').AppConfig,
  crypto: {
    randomUUID(): string,
  },
  // From global scope
  HTMLElement: any,
}

export type ElementExports = {
  constructor(): any,
  connectedCallback(): void,
  onSubmit(event: any): void,
  submit(): void
}
