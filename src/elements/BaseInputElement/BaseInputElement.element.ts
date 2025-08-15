import {ElementImports, BaseInput, StyleUpdateEvent, WindowEvent} from "./types";

function baseInputElement_injector($inject: ElementImports) {
  const {
    HTMLElement,
    window,
    document,
    MastercardEventEmitter,
    appConfig,
    logger,
    sleep,
  } = $inject;

  return class BaseInputElement extends HTMLElement implements BaseInput {
    formId: string|null;
    elemId: string|null;
    frameReady: boolean;
    innerFrame: HTMLIFrameElement;
    emitter = new MastercardEventEmitter();
    _hasChanged: boolean;
    componentStyles: string;

    constructor() {
      super();
      this.frameReady = false; // Let's us know when the inner iframe has finished loading
      // this.isConnected = <this comes from HTMLElement>;
      this.innerFrame = document.createElement('iframe');
      // This is our internal emitter. Events here are exposed via this
      // class' addEventListener and removeEventListener methods
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
    static get observedAttributes() {
      return ['id', 'form-id', 'component-styles'];
    }

    addEventListener(eventName: string, callback: (eventData: any) => void) {
      this.emitter.on(eventName, callback);
    }

    removeEventListener(eventName: string, callback: (eventData: any) => void) {
      this.emitter.off(eventName, callback);
    }
    /**
     * @internal
     */
    async attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
     * @internal
     */
    connectedCallback() {
      this.formId = this.getAttribute('form-id');
      this.elemId = this.getAttribute('id');
      this.componentStyles = this.getAttribute('component-styles') ?? '';
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

    async render() {
      while (this.isConnected === false || this.frameReady === false) {
        await sleep();
      }
      if (typeof this.componentStyles !== 'string') {
        return;
      }
      try {
        const eventData: StyleUpdateEvent = {
          eventType: 'updateStyle',
          data: this.componentStyles,
        };
        this.innerFrame.contentWindow?.postMessage(
          eventData,
          appConfig.getFrameOrigin()
        );
        /* eslint-disable @typescript-eslint/no-unused-vars */
      } catch (err) {
        logger.error('Unable to postMessage to inner frame');
      }
    }

    generateIframeURL(formId: string|null, elemId:string|null): string {
      return `${formId}${elemId}`;
    }

    registerInputEvents() {
      window.addEventListener(
        'message', (evt: WindowEvent) => {
          if (evt.origin !== appConfig.getFrameOrigin()) {
            logger.warn('Ignoring message from unknown origin');
            return;
          }
          const eventType = evt.data.eventType;
          switch (eventType) {
            case 'inputReady': {
              this.frameReady = true;
              this.render();
              this.emitter.emit('ready', {});
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
