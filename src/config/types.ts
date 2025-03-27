export type AppConfig = {
  setSDKBase(newBase: string): void,
  getSDKBase(): string,
  getFrameOrigin(): string,
}

export type ConfigImports = {
  APP_SDK_BASE: string
}