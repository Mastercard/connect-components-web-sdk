import {ElementImports, EventMessage} from "./types";
import { EventTypes } from "../../types";
function mastercardForm_injector($inject: ElementImports) {
  const {appConfig, HTMLElement, crypto, logger, EventStream, MutationObserver } =
    $inject;

  return class MastercardForm extends HTMLElement {
    eventStream: typeof EventStream |null;
    events: any;
    observer: MutationObserver | undefined;

    constructor() {
      super();
      this.eventStream = null;
      this.events = null;
    }

    // - Lifecycle events
    connectedCallback() {
      const existingEventStream = this.querySelector('mastercard-event-stream');
      if (existingEventStream) {
        // @ts-ignore
        this.eventStream = existingEventStream;
      } else if (this.getAttribute('event-stream-id')?.length) {
        const streamId = this.getAttribute('event-stream-id');
        // @ts-ignore
        this.eventStream = document.createElement('mastercard-event-stream');
        // @ts-ignore
        this.eventStream.setAttribute('event-stream-id', streamId ?? '');
        // @ts-ignore
        this.appendChild(this.eventStream);
        // @ts-ignore
        this.events = this.eventStream.events;
      }
      // Proxy this to make it easier to access
      this.observer = new MutationObserver(() => {
        const mastercardInputs = this.querySelectorAll('mastercard-input');
        Array.from(mastercardInputs).filter(elem => {
            return elem.getAttribute('form-id') !== this.id;
          })
          .forEach(elem => {
            elem.setAttribute('form-id', this.id);
          });
        const mastercardMFAChoices = this.querySelectorAll('mastercard-mfa-choice');
        Array.from(mastercardMFAChoices)
          .filter((elem) => {
            return elem.getAttribute('form-id') !== this.id;
          })
          .forEach((elem) => {
            elem.setAttribute('form-id', this.id);
          });
      });

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
     */
    onSubmit(event: Event) {
      event.preventDefault();
      this.submit();
    }

    /**
     * Sends a message to the orchestration service, which lives in the event stream iframe
     */
    submit() {
      const requestId = crypto.randomUUID();
      const targetOrigin = appConfig.getSDKBase();
      const message: EventMessage = {
        formId: this.getAttribute('id') ?? '',
        eventType: EventTypes.SUBMIT_REQUEST,
        requestId,
      };
      if (this.eventStream) {
        message.eventStreamId =
        // @ts-ignore
          this.eventStream.getAttribute('event-stream-id');
          this.eventStream
            // @ts-ignore
            .querySelector('iframe')
            .contentWindow.postMessage(message, targetOrigin);
      } else {
        logger.warn(`No event stream registered!`);
      }
    }
  };
}

export { mastercardForm_injector };
