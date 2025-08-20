import {ElementImports} from "./types";
function mastercardInput_injector($inject: ElementImports) {
  const { appConfig, BaseInputElement } = $inject;

  return class MastercardInput extends BaseInputElement {
    constructor() {
      super();
    }
    generateIframeURL(formId: string, elementId: string) {
      return `${appConfig.getSDKBase()}/frames/parent/login-forms/${formId}/elements/${elementId}/contents.html`;
    }
  };
}

export { mastercardInput_injector };
