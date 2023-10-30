/**
 * @param {import('./types').ElementImports} $inject
 */
function mastercardInput_injector($inject) {
  const { appConfig, HTMLElement, sleep } = $inject;
  return class MastercardInput extends HTMLElement {
    /**
      * @type {import('./types').ElementExports['constructor']}
      */
    constructor () {
      super();

      this.innerFrame = document.createElement('iframe');
      let eventTarget = new EventTarget();
      // This will give us the ability to listen for events directly on this element
      Object.assign(this, eventTarget);
      // There are some issues trying to directly test this.<event method>, like 
      // addEventListener. This is possibly because of how we've set up our tests, 
      // or maybe Mocha clobber's our 'this'
      this._eventTarget = eventTarget;
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
      if (this.isConnected) {
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
      while (this.isConnected === false) {
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
      }, '*');
      this.style = this.generateOuterStyle(generatedStyle);
    }

    /**
     * @type {import('./types').ElementExports['generateOuterStyle']}
     */
    generateOuterStyle(generatedStyle) {
      const validKeys = Object.keys(generatedStyle).filter(key => {
        return key.charAt(0) !== '-';
      });
      const newStyle = {};
      validKeys.forEach(key => {
        try {
          // @ts-ignore
          newStyle[key] = generatedStyle[key];
        } catch (err) {
          // ignore - some styles can't be modified
        }
      });
      return newStyle;
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
      window.addEventListener('message', (evt) => {
        const eventType = evt.data.messageType;
        switch (eventType) {
          case 'inputReady':
            this.render();
            const readyEvent = new Event('ready');
            this._eventTarget.dispatchEvent(readyEvent);
            break;
          case 'inputBlur':
            if (evt.data.elementId === this.elemId) {
              const blurEvent = new Event('blur');
              // @ts-ignore
              blurEvent.data = evt.data;
              this._eventTarget.dispatchEvent(blurEvent);
            }
            break;
          case 'inputFocus':
            if (evt.data.elementId === this.elemId) {
              const focusEvent = new Event('focus');
              // @ts-ignore
              focusEvent.data = evt.data;
              this._eventTarget.dispatchEvent(focusEvent);
            }
            break;
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
