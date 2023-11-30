/** @type {URL} */
const sdkBase = new URL(process.env.APP_SDK_BASE ?? 'http://localhost');
/**
 * @type {import('./types').AppConfig}
 */
const appConfig = {
  sdkBase: sdkBase.toString(),
  frameOrigin: sdkBase.origin,
};

export { appConfig };
