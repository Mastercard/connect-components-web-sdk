/** @param {import('../types').ConfigImports} $inject */
function appConfig_injector($inject) {
  const { APP_SDK_BASE } = $inject;
  /** @type {URL} */
  let sdkBase;

  /**
   * For local testing. This does not need to be documented, and customers should not
   * use this.
   * @type {import('../types').AppConfig['setSDKBase']}
   */
  function setSDKBase(newBase) {
    sdkBase = new URL(newBase);
  }

  /**
   * @type {import('../types').AppConfig['getSDKBase']}
   */
  function getSDKBase() {
    // Always fall back to default if the sdk base gets clobbered
    if (!sdkBase) {
      sdkBase = new URL(APP_SDK_BASE);
    }
    let base = sdkBase.toString();
    if (base.charAt(base.length - 1) === '/') {
      base = base.substring(0, base.length - 1);
    }
    return base;
  }

  /**
   * @type {import('../types').AppConfig['getFrameOrigin']}
   */
  function getFrameOrigin() {
    // Always fall back to default if the sdk base gets clobbered
    if (!sdkBase) {
      sdkBase = new URL(APP_SDK_BASE);
    }
    return sdkBase.origin;
  }

  /**
   * @type {import('../types').AppConfig}
   */
  return {
    // sdkBase: sdkBase.toString(),
    // frameOrigin: sdkBase.origin,
    setSDKBase,
    getSDKBase,
    getFrameOrigin,
  };
}

export { appConfig_injector };
