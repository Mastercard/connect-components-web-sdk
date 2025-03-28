/** @param {import('./types').ElementImports} $inject */
function baseInputElement_injector($inject) {
  const {
    HTMLElement,
    window,
    document,
    MastercardEventEmitter,
    appConfig,
    logger,
    sleep,
  } = $inject;

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
      this.componentStyles = JSON.stringify({
        input: {},
        radio: {},
        image: {},
        label: {},
      });
    }

    // - Static methods
    /**
     * @static
     * @type {import('./types').ElementExports['observedAttributes']}
     */
    static get observedAttributes() {
      return ['id', 'form-id', 'component-styles'];
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
      if (name === 'component-styles') {
        this.componentStyles = newValue;
        this._hasChanged = true;
      } else if (name === 'id' && oldValue !== newValue) {
        this.elemId = newValue;
        this._hasChanged = true;
      } else if (name === 'form-id' && oldValue !== newValue) {
        this.formId = newValue;
        this._hasChanged = true;
      }
      if (!this.elemId || !this.formId) {
        return;
      }
      if (this._hasChanged) {
        this._hasChanged = false;
        this.render();
      }
    }

    /**
     * @type {import('./types').ElementExports['connectedCallback']}
     */
    connectedCallback() {
      this.formId = this.getAttribute('form-id');
      this.elemId = this.getAttribute('id');
      this.componentStyles = this.getAttribute('component-styles');
      this.appendChild(this.innerFrame);

      const src = this.generateIframeURL(this.formId, this.elemId);
      this.innerFrame.setAttribute('src', src);
      Object.assign(this.innerFrame.style, {
        width: '100%',
        height: '100%',
        border: 'none',
      });
      this.registerInputEvents();
    }

    /**
     * @type {import('./types').ElementExports['render']}
     */
    async render() {
      while (this.isConnected === false || this.frameReady === false) {
        await sleep();
      }
      if (typeof this.componentStyles !== 'string') {
        return;
      }
      try {
        const eventData = {
          eventType: 'updateStyle',
          data: this.componentStyles,
        };
        this.innerFrame.contentWindow.postMessage(
          eventData,
          appConfig.getFrameOrigin()
        );
      } catch (err) {
        logger.error('Unable to postMessage to inner frame');
      }
    }

    /**
     * @interface
     * @param {string} formId
     * @param {string} elemId
     * @returns {string}
     */
    generateIframeURL(formId, elemId) {
      return `${formId}${elemId}`;
    }

    registerInputEvents() {
      window.addEventListener(
        'message',
        (
          /** @type {{ origin: any; data: { eventType: any; elementId: any; }; }} */ evt
        ) => {
          if (evt.origin !== appConfig.getFrameOrigin()) {
            logger.warn('Ignoring message from unknown origin');
            return;
          }
          const eventType = evt.data.eventType;
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
  };
}

export { baseInputElement_injector };
