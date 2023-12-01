/** @param {import('../types').ConfigImports} $inject */
function appConfig_injector($inject) {
  const { APP_SDK_BASE } = $inject;
  /** @type {URL} */
  const sdkBase = new URL(APP_SDK_BASE);

  /**
   * @type {import('../types').AppConfig}
   */
  return {
    sdkBase: sdkBase.toString(),
    frameOrigin: sdkBase.origin,
  };
}

export { appConfig_injector };
