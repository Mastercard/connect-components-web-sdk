/** @param {import('./types').ElementImports} $inject */
function mastercardForm_injector($inject) {
  const { appConfig, HTMLElement, crypto, logger, document, MutationObserver } =
    $inject;

  return class MastercardForm extends HTMLElement {
    /**
     * @type {import('./types').ElementExports['constructor']}
     */
    constructor() {
      super();
      this.eventStream = null;
      this.events = null;
    }

    // - Lifecycle events
    /**
     * @type {import('./types').ElementExports['connectedCallback']}
     */
    connectedCallback() {
      const existingEventStream = this.querySelector('mastercard-event-stream');
      if (existingEventStream) {
        this.eventStream = existingEventStream;
      } else if (this.getAttribute('event-stream-id')?.length) {
        /** @type {string} */
        // @ts-ignore
        const streamId = this.getAttribute('event-stream-id');
        this.eventStream = document.createElement('mastercard-event-stream');
        this.eventStream.setAttribute('event-stream-id', streamId);
        this.appendChild(this.eventStream);
        this.events = this.eventStream.events;
      }
      // Proxy this to make it easier to access
      this.observer = new MutationObserver(() => {
        Array.from(this.querySelectorAll('mastercard-input'))
          .filter((elem) => {
            return elem.getAttribute('form-id') !== this.id;
          })
          .forEach((elem) => {
            elem.setAttribute('form-id', this.id);
          });
        Array.from(this.querySelectorAll('mastercard-mfa-choice'))
          .filter((elem) => {
            return elem.getAttribute('form-id') !== this.id;
          })
          .forEach((elem) => {
            elem.setAttribute('form-id', this.id);
          });
      });

      // @ts-ignore
      this.observer.observe(this, {
        subtree: true,
        childList: true,
        characterData: false,
      });
    }

    // - Custom methods
    /**
     * This method is used to intercept native onSubmit calls and forward them to our own custom
     * submit function
     * @type {import('./types').ElementExports['onSubmit']}
     */
    onSubmit(event) {
      event.preventDefault();
      this.submit();
    }

    /**
     * Sends a message to the orchestration service, which lives in the event stream iframe
     * @type {import('./types').ElementExports['submit']}
     */
    submit() {
      const requestId = crypto.randomUUID();
      const targetOrigin = appConfig.sdkBase;
      const message = {
        formId: this.getAttribute('id'),
        eventType: 'submitRequest',
        requestId,
      };
      if (this.eventStream) {
        // @ts-ignore
        message.eventStreamId =
          this.eventStream.getAttribute('event-stream-id');
          // @ts-ignore
          this.eventStream
            .querySelector('iframe')
            .contentWindow.postMessage(message, targetOrigin);
      } else {
        logger.warn(`No event stream registered!`);
      }
    }
  };
}

export { mastercardForm_injector };
