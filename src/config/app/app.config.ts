import { ConfigImports } from "../types";
function appConfig_injector($inject: ConfigImports) {
  const { APP_SDK_BASE } = $inject;
  let sdkBase: URL;

  /**
   * For local testing. This does not need to be documented, and customers should not
   * use this.
   */
  function setSDKBase(newBase: string) {
    sdkBase = new URL(newBase);
  }

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

  function getFrameOrigin() {
    // Always fall back to default if the sdk base gets clobbered
    if (!sdkBase) {
      sdkBase = new URL(APP_SDK_BASE);
    }
    return sdkBase.origin;
  }

  return {
    // sdkBase: sdkBase.toString(),
    // frameOrigin: sdkBase.origin,
    setSDKBase,
    getSDKBase,
    getFrameOrigin,
  };
}

export { appConfig_injector };
