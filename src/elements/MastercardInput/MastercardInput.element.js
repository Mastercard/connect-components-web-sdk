/** @param {import('./types').ElementImports} $inject */
function mastercardInput_injector($inject) {
  const { appConfig, BaseInputElement, sleep, window, document, logger } =
    $inject;

  // @ts-ignore
  return class MastercardInput extends BaseInputElement {
    /**
     * @type {import('./types').ElementExports['constructor']}
     */
    constructor() {
      super();
    }

    // - Static methods
    /**
     * @static
     * @type {import('./types').ElementExports['observedAttributes']}
     */
    static get observedAttributes() {
      return ['id', 'form-id', 'class'];
    }

    /**
     * The reason for the queue microtask is to prevent the connected callback and the attribute change
     * triggering at the same time and firing off http calls that will ultimately get cancelled. This way
     * both can update this value in the same process tick, and at the end of that tick we'll just render once
     * @type {import('./types').ElementExports['render']}
     */
    async render() {
      while (this.isConnected === false || this.frameReady === false) {
        await sleep();
      }
      const generatedStyle = this.generateAutoStyleObject();
      const innerStyleObject = this.generateInnerStyleObject(generatedStyle);

      // @ts-ignore
      this.innerFrame.contentWindow.postMessage(
        {
          eventType: 'updateStyle',
          payload: {
            input: innerStyleObject,
          },
        },
        appConfig.frameOrigin
      );
      this.generateOuterStyle(generatedStyle, this.style);
    }

    /**
     * @type {import('./types').ElementExports['connectedCallback']}
     */
    connectedCallback() {
      this.appendChild(this.innerFrame);
      Object.assign(this.innerFrame.style, {
        width: '100%',
        height: '100%',
        border: 'none',
      });
      const src = `${appConfig.sdkBase}/frames/parent/login-forms/${this.formId}/elements/${this.elemId}/contents.html`;
      this.innerFrame.setAttribute('src', src);
      this.registerInputEvents();
    }

    registerInputEvents() {
      window.addEventListener(
        'message',
        (
          /** @type {{ origin: any; data: { messageType: any; elementId: any; }; }} */ evt
        ) => {
          if (evt.origin !== appConfig.frameOrigin) {
            logger.warn('Ignoring message from unknown origin');
            return;
          }
          const eventType = evt.data.messageType;
          switch (eventType) {
            case 'inputReady': {
              this.frameReady = true;
              this.render();
              this.emitter.emit('ready');
              break;
            }
            case 'inputBlur': {
              if (evt.data.elementId !== this.elemId) {
                return;
              }
              this.emitter.emit('blur', evt.data);
              break;
            }
            case 'inputFocus': {
              if (evt.data.elementId !== this.elemId) {
                return;
              }
              this.emitter.emit('focus', evt.data);
              break;
            }
          }
        }
      );
    }

    /**
     * @type {import('./types').ElementExports['generateStyleObject']}
     */
    generateInnerStyleObject(newStyle) {
      const validStyleList = [
        'backgroundColor',
        'color',
        'fontFamily',
        'fontKerning',
        'fontSize',
        'fontStretch',
        'fontWeight',
        'lineHeight',
        'letterSpacing',
        'textAlign',
        'textIndent',
        'textJustify',
        'textShadow',
        'textTransform',
        'verticalAlign',
        'writingMode',
      ];
      const validated = {};
      for (const key in newStyle) {
        if (validStyleList.includes(key)) {
          // @ts-ignore
          validated[key] = newStyle[key];
        }
      }
      return validated;
    }

    /**
     * @type {import('./types').ElementExports['generateAutoStyleObject']}
     */
    generateAutoStyleObject() {
      const mockElement = document.createElement('input');
      mockElement.setAttribute('type', 'text');
      return this.generateBaseStyle(mockElement);
    }
  };
}

export { mastercardInput_injector };
