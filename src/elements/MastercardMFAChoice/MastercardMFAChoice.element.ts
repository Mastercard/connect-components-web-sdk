import {ElementImports} from './types'
function mastercardMfaChoice_injector($inject: ElementImports) {
  const { appConfig, BaseInputElement } = $inject;

  return class MastercardInput extends BaseInputElement {
    constructor() {
      super();
    }
    generateIframeURL(formId: string|null, elementId: string|null) {
      return `${appConfig.getSDKBase()}/frames/parent/mfa/${formId}/elements/${elementId}/contents.html`;
    }
  };
}

export { mastercardMfaChoice_injector };
