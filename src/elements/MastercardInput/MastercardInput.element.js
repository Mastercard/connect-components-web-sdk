/** @param {import('./types').ElementImports} $inject */
function mastercardInput_injector($inject) {
  const { appConfig, BaseInputElement } = $inject;

  // @ts-ignore
  return class MastercardInput extends BaseInputElement {
    /**
     * @type {import('./types').ElementExports['generateIframeURL']}
     */
    generateIframeURL(formId, elementId) {
      return `${appConfig.getSDKBase()}/frames/parent/login-forms/${formId}/elements/${elementId}/contents.html`;
    }
  };
}

export { mastercardInput_injector };
