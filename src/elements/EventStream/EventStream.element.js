/**
 * @param {import('./types').ElementImports} $inject 
 */
function eventStream_injector($inject) {
  const { appConfig, HTMLElement, logger } = $inject;

  return class MastercardEventStream extends HTMLElement {
    /**
     * @constructor
     * @type {import('./types').ElementExports['constructor']}
     */
    constructor () {
      super();
      this.eventStreamId = null;
      this.events = new EventTarget();
    }
    // - Static methods
    /**
     * @static
     * @type {import('./types').ElementExports['observedAttributes']}
     */
    static get observedAttributes() {
      // @ts-ignore
      return ['event-stream-id'];
    }

    // - Lifecycle Events
    /**
     * @type {import('./types').ElementExports['connectedCallback']}
     */
    connectedCallback() {
      const $elem = this;
      if (!this.eventStreamId) {
        this.eventStreamId = $elem.getAttribute('event-stream-id');
      }

      this.iframe = document.createElement('iframe');
      $elem.append(this.iframe);
      $elem.style.display = 'none';
      if (this.eventStreamId) {
        this._bindFrameSource();
        this._registerEventListener();
      }
    }
    /**
     * @type {import('./types').ElementExports['attributeChangedCallback']}
     */
    attributeChangedCallback(name, _oldValue, newValue) {
      if (!this.isConnected) {
        return;
      }
      if (name === 'event-stream-id') {
        this.eventStreamId = newValue;
        this._bindFrameSource();
        this._registerEventListener();
      }
    }

    // - Custom Methods

    /**
     * @access private
     * @type {import('./types').ElementExports['_bindFrameSource']}
     */
    _bindFrameSource() {
      const frameSource = `${appConfig.sdkBase}/frames/parent/forms/event-stream.html?event-stream-id=${this.eventStreamId}`;
      // @ts-ignore
      this.iframe.setAttribute('src', frameSource);
    }

    /**
     * @access private
     * @type {import('./types').ElementExports['_registerEventListener']}
     */
    _registerEventListener() {
      window.addEventListener('message', event => {
        if (event.origin !== appConfig.frameOrigin) {
          logger.warn(`Skipping message from ${event.origin}`);
          return;
        }
        /*
        There is some conversion that needs to happen here to make this event not look really messy.
        First, we create a local event (instead of an SSE event), then we use the eventType from the
        payload to determine the kind of event to send. Then we add the id of the event. Then we clear
        out the payload of those values so we don't have duplicates
        */
        const newEvent = new Event(event.data.eventType);
        // @ts-ignore
        newEvent.data = event.data;
        // @ts-ignore
        newEvent.id = event.data.id;
        // @ts-ignore
        delete newEvent.data.isPublic;
        // @ts-ignore
        delete newEvent.data.eventType;
        // @ts-ignore
        delete newEvent.data.id;
        this.events.dispatchEvent(newEvent);
      });
    }

    /**
     * @method
     * @type {import('./types').ElementExports['_isValidEventStreamId']}
     */
    _isValidEventStreamId(id) {
      const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return isValid.test(id);
    }
  }
}

export { eventStream_injector };
