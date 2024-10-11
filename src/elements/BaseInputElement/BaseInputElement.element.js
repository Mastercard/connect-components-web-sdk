/** @param {import('./types').ElementImports} $inject */
function baseInputElement_injector($inject) {
  const { HTMLElement, window, document, MastercardEventEmitter } = $inject;

  /** @type {HTMLElement} */
  // @ts-ignore
  return class BaseInputElement extends HTMLElement {
    /**
     * @type {import('./types').ElementExports['constructor']}
     */
    constructor() {
      super();
      this.frameReady = false; // Let's us know when the inner iframe has finished loading
      // this.isConnected = <this comes from HTMLElement>;
      this.innerFrame = document.createElement('iframe');
      // This is our internal emitter. Events here are exposed via this
      // class' addEventListener and removeEventListener methods
      // @ts-ignore
      this.emitter = new MastercardEventEmitter();
      this.elemId = null;
      this.formId = null;
      this._hasChanged = false;
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
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'id' && oldValue !== newValue) {
        this.elemId = this.getAttribute('id');
        this._hasChanged = true;
      } else if (name === 'form-id' && oldValue !== newValue) {
        this.formId = this.getAttribute('form-id');
        this._hasChanged = true;
      }
      if (!this.elemId || !this.formId) {
        return;
      }
      if (this._hasChanged && this.isConnected && this.frameReady) {
        this._hasChanged = false;
        this.render();
      }
    }

    /**
     * Base function for the other styling functions
     * @access private
     * @type {import('./types').ElementExports['generateBaseStyle']}
     */
    generateBaseStyle(mockElement) {
      this.parentElement.append(mockElement);
      if (this.classList.length) {
        Array.from(this.classList).forEach((className) => {
          mockElement.classList.add(className);
        });
      }
      const computedStyle = window.getComputedStyle(mockElement, null);
      const styleObject = {};
      Object.keys(computedStyle).forEach((key) => {
        // @ts-ignore
        styleObject[key] = computedStyle[key];
      });
      this.parentElement.removeChild(mockElement);
      return styleObject;
    }

    /**
     * @type {import('./types').ElementExports['generateOuterStyle']}
     */
    generateOuterStyle(generatedStyle, target) {
      const validKeys = Object.keys(generatedStyle).filter((key) => {
        return key.charAt(0) !== '-';
      });
      validKeys.forEach((key) => {
        try {
          // @ts-ignore
          target[key] = generatedStyle[key];
        } catch (err) {
          // ignore - some styles can't be modified
        }
      });
    }
  };
}

export { baseInputElement_injector };
