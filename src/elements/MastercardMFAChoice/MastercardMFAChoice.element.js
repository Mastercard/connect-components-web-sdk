/**
 * @param {import('./types').ElementImports} $inject
 */
function mastercardMfaChoice_injector($inject) {
  const {
    appConfig,
    HTMLElement,
    sleep,
    document,
    window,
    logger,
    MastercardEventEmitter,
  } = $inject;

  return class MastercardInput extends HTMLElement {
    /**
      * @type {import('./types').ElementExports['constructor']}
      */
    constructor () {
      super();
      this.frameReady = false; // Let's us know when the inner iframe has finished loading
      this.innerFrame = document.createElement('iframe');
      // @ts-ignore
      Object.assign(this, new MastercardEventEmitter());
    }

    // - Static methods
    /**
     * @static
     * @type {import('./types').ElementExports['observedAttributes']}
     */
    static get observedAttributes() {
      // @ts-ignore
      return ['id', 'form-id', 'class'];
    }

    /**
     * 
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
      const inputStyle = this.generateInputStyleObject();
      const radioStyle = this.generateRadioStyleObject();
      const imageStyle = this.generateImageStyleObject();
      const labelStyle = this.generateLabelStyleObject();

      const innerInputStyleObject = this.generateInnerStyleObject(inputStyle);
      const innerRadioStyle = this.generateInnerStyleObject(radioStyle);
      const innerImageStyle = this.generateInnerStyleObject(imageStyle);
      const innerLabelStyle = this.generateInnerStyleObject(labelStyle);
      // Note, there is an issue where the iframe isn't fully loaded but we are
      // trying to send events to it. This needs to be fixed at some point
      // @ts-ignore
      this.innerFrame.contentWindow.postMessage({
        eventType: 'updateStyle',
        payload: {
          input: innerInputStyleObject,
          radio: innerRadioStyle,
          image: innerImageStyle,
          label: innerLabelStyle
        }
      }, appConfig.frameOrigin);
      const generatedStyle = this.style;
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
      const src = `${appConfig.sdkBase}/frames/parent/mfa/${this.formId}/elements/${this.elemId}/contents.html`;
      this.innerFrame.setAttribute('src', src);
      this.registerInputEvents();
    }

    /**
     * @type {import('./types').ElementExports['registerInputEvents']}
     */
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
            const inputReadyEvent = new Event('ready');
            this.dispatchEvent(inputReadyEvent);
            break;
          }
          case 'inputBlur': {
            const blurEvent = new Event('blur');
            // @ts-ignore
            blurEvent.data = evt.data;
            this.dispatchEvent(blurEvent);
            break;
          }
          case 'inputFocus': {
            const focusEvent = new Event('focus');
            // @ts-ignore
            focusEvent.data = evt.data;
            this.dispatchEvent(focusEvent);
            break;
          }
        }
      });
    }

    /**
     * @type {import('./types').ElementExports['generateInnerStyleObject']}
     */
    generateInnerStyleObject(newStyle) {
      const validStyleList = [
        'height',
        'backgroundColor',
        'color',
        'cursor',
        'display',
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
        'paddingTop',
        'paddingLeft',
        'paddingRight',
        'paddingBottom',
        'padding',
        'zIndex',
        'position',
        'top',
        'left',
        'right',
        'bottom',
        'marginTop',
        'marginLeft',
        'marginBottom',
        'marginRight',
        'margin'
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
     * @type {import('./types').ElementExports['generateInputStyleObject']}
     */
    generateInputStyleObject() {
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
    /**
     * @type {import('./types').ElementExports['generateRadioStyleObject']}
     */
    generateRadioStyleObject() {
      const mockElement = document.createElement('input');
      mockElement.setAttribute('type', 'radio');
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
    /**
     * @type {import('./types').ElementExports['generateImageStyleObject']}
     */
    generateImageStyleObject() {
      const mockElement = document.createElement('img');
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
    /**
     * @type {import('./types').ElementExports['generateLabelStyleObject']}
     */
    generateLabelStyleObject() {
      const mockElement = document.createElement('label');
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

export default mastercardMfaChoice_injector;
