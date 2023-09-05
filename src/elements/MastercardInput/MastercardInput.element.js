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
      this.innerFrame.classList.add('mastercard-secure-inputs');
      this.innerFrame.setAttribute('src', 'about:blank');
      this.styleObject = {};
      this.scheduledRender = false;
      // A reference to the currently encoded inner style. This will help us know if we need to rerender the frame, which
      // deletes user input, so we want to do that as little as possible
      this.lastEncodedStyle = '';
      // A reference to setStyle or setMerge, with the original params wrapped in a closure
      this.styleStrategy = () => { this.setStyle('auto'); };
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
    async attributeChangedCallback(name) {
      if (name === 'class') {
        await this.styleStrategy();
      }
      this.elemId = this.getAttribute('id');
      this.formId = this.getAttribute('form-id');
      if (!this.elemId || !this.formId || !this.innerFrame) {
        return;
      }
      if (this.isConnected && !this.scheduledRender) {
        this.render();
      }
    }

    /**
     * @type {import('./types').ElementExports['setStyle']}
     */
    async setStyle(newStyle) {
      this.styleStrategy = () => { this.setStyle(newStyle); }
      if (!newStyle || newStyle === 'auto') {
        // do auto styling using dummy element
        this.styleObject = await this.generateAutoStyleObject();
      } else {
        this.styleObject = newStyle;
      }
      this.render();
    }

    /**
     * DO NOT await this! It will block the entire event loop if this is awaited
     * and the client application has not yet appended this element to the DOM
     * @type {import('./types').ElementExports['mergeStyle']}
     */
    mergeStyle(newStyle = {}) {
      this.styleStrategy = () => { this.mergeStyle(newStyle); }
      this.generateAutoStyleObject().then(autoStyle => {
        this.styleObject = Object.assign(autoStyle, newStyle);
        this.render();
      });
    }

    /**
     * The reason for the queue microtask is to prevent the connected callback and the attribute change
     * triggering at the same time and firing off http calls that will ultimately get cancelled. This way
     * both can update this value in the same process tick, and at the end of that tick we'll just render once
     * @type {import('./types').ElementExports['render']}
     */
    async render() {
      this.scheduledRender = true;
      while (this.isConnected === false) {
        await sleep();
      }
      const innerStyleObject = this.generateInnerStyleObject(this.styleObject);
      const encodedStyle = this.generateStyleString(innerStyleObject);
      if (encodedStyle !== this.lastEncodedStyle) {
        const src = `${appConfig.sdkBase}/frames/parent/login-forms/${this.formId}/elements/${this.elemId}/contents.html?style=${encodedStyle}`;
        this.innerFrame.setAttribute('src', src);
        this.lastEncodedStyle = encodedStyle;
      }
      this.style = {};
      const validKeys = Object.keys(this.styleObject).filter(key => {
        return key.charAt(0) !== '-';
      });
      validKeys.forEach(key => {
        try {
          // @ts-ignore
          this.style[key] = this.styleObject[key];
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
     * @type {import('./types').ElementExports['generateStyleString']}
     */
    generateStyleString(styleObject) {
      // @ts-ignore
      const styleString = Object.keys(styleObject).map(key => {
        // @ts-ignore
        return `${key}=${styleObject[key]}`;
      }).join('|');
      const encodedStyle = window.btoa(styleString);
      return encodedStyle;
    }

    /**
     * @type {import('./types').ElementExports['generateAutoStyleObject']}
     */
    async generateAutoStyleObject() {
      while (this.isConnected == false) {
        await sleep();
      }
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
