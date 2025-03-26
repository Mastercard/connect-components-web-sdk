/** @param {import('./types').ElementImports} $inject */
function mastercardMfaChoice_injector($inject) {
  const { appConfig, BaseInputElement } = $inject;

  return class MastercardInput extends BaseInputElement {
    /**
     * @type {import('./types').ElementExports['generateIframeURL']}
     */
    generateIframeURL(formId, elementId) {
      return `${appConfig.sdkBase}/frames/parent/mfa/${formId}/elements/${elementId}/contents.html`;
    }
  };
}

export { mastercardMfaChoice_injector };
