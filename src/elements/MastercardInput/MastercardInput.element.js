/**
 * @param {import('./types').ElementImports} $inject
 */
function mastercardInput_injector($inject) {
  const {
    appConfig,
    HTMLElement,
    sleep,
    window,
    document,
    logger,
    MastercardEventEmitter
  } = $inject;

  /** @type {HTMLElement} */
  // @ts-ignore
  return class MastercardInput extends HTMLElement {
    /**
      * @type {import('./types').ElementExports['constructor']}
      */
    constructor () {
      super();
      this.frameReady = false; // Let's us know when the inner iframe has finished loading
      this.innerFrame = document.createElement('iframe');

      // This is our internal emitter. Events here are exposed via this
      // class' addEventListener and removeEventListener methods
      // @ts-ignore
      this.emitter = new MastercardEventEmitter();
    }

    // - Static methods
    /**
     * @static
     * @type {import('./types').ElementExports['observedAttributes']}
     */
    static get observedAttributes() {
      return ['id', 'form-id', 'class'];
    }

    /** @type {import('./types').ElementExports['addEventListener']} */
    addEventListener(eventName, callback) {
      this.emitter.on(eventName, callback);
    }

    /** @type {import('./types').ElementExports['removeEventListener']} */
    removeEventListener(eventName, callback) {
      this.emitter.off(eventName, callback);
    }

    /**
     * @type {import('./types').ElementExports['attributeChangedCallback']}
     */
    async attributeChangedCallback() {
      this.elemId = this.getAttribute('id');
      this.formId = this.getAttribute('form-id');
      if (!this.elemId || !this.formId || !this.innerFrame) {
        return;
      }
      if (this.isConnected && this.frameReady) {
        this.render();
      }
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
      const generatedStyle = this.generateAutoStyleObject()
      const innerStyleObject = this.generateInnerStyleObject(generatedStyle);

      // @ts-ignore
      this.innerFrame.contentWindow.postMessage({
        eventType: 'updateStyle',
        payload: {
          input: innerStyleObject
        }
      }, appConfig.frameOrigin);
      this.generateOuterStyle(generatedStyle, this.style);
    }

    /**
     * @type {import('./types').ElementExports['generateOuterStyle']}
     */
    generateOuterStyle(generatedStyle, target) {
      const validKeys = Object.keys(generatedStyle).filter(key => {
        return key.charAt(0) !== '-';
      });
      validKeys.forEach(key => {
        try {
          // @ts-ignore
          target[key] = generatedStyle[key];
        } catch (err) {
          // ignore - some styles can't be modified
        }
      });
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
      window.addEventListener('message', (/** @type {{ origin: any; data: { messageType: any; elementId: any; }; }} */ evt) => {
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
      });
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
      this.parentElement.append(mockElement);
      if (this.classList.length) {
        Array.from(this.classList).forEach(className => {
          mockElement.classList.add(className);
        });
      }
      const computedStyle = window.getComputedStyle(mockElement, null);
      const styleObject = {};
      Object.keys(computedStyle).forEach(key => {
        // @ts-ignore
        styleObject[key] = computedStyle[key];
      });
      this.parentElement.removeChild(mockElement);
      return styleObject;
    }
  }
}

export default mastercardInput_injector;
