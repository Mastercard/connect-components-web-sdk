import {ElementImports, MastercardEventStreamInterface } from "./types";
import { EventTypes } from "../../types";

interface PostmessageEvent extends WindowProxy {
  id: string,
  data: {
    eventType: EventTypes,
    id: string,
    data: {
      isPublic: boolean,
    }
  }
}

class InternalEvent extends Event {
  data: {
    isPublic?: boolean,
    eventType?: EventTypes,
    id?: string
  };
  id: string = '';
  isPublic: boolean = false;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.data = {
      isPublic: false
    }
  }
}

function eventStream_injector($inject: ElementImports) {
  const {appConfig, HTMLElement, logger, document, window } = $inject;

  class MastercardEventStream extends HTMLElement implements MastercardEventStreamInterface {

    formId: string|null;
    eventStreamId: string|null;
    events: EventTarget;
    iframe: HTMLIFrameElement|undefined;

    constructor() {
      super();
      this.eventStreamId = null;
      this.formId = null;
      this.events = new EventTarget();
    }
    // - Static methods
    static get observedAttributes() {
      return ['event-stream-id', 'form-id'];
    }

    // - Lifecycle Events
    connectedCallback() {
      /* eslint-disable @typescript-eslint/no-this-alias */
      const $elem = this;
      if (!this.eventStreamId) {
        this.eventStreamId = $elem.getAttribute('event-stream-id');
      }
      if (!this.formId && $elem.getAttribute('form-id')) {
        this.formId = $elem.getAttribute('form-id');
      } else if (!this.formId) {
        try {
          // This doesn't exist in the oauth rediretion flow
          this.formId = $elem.closest('mastercard-form')?.getAttribute('id') ?? 'default';
          /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (err) {
          this.formId = 'default';
        }
      }
      this.iframe = document.createElement('iframe');
      $elem.append(this.iframe ?? '');
      $elem.style.display = 'none';
      if (this.eventStreamId) {
        this._bindFrameSource();
        this._registerEventListener();
      }
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
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
    _bindFrameSource() {
      const frameSource = `${appConfig.getSDKBase()}/frames/parent/forms/event-stream.html?event-stream-id=${
        this.eventStreamId
      }&form-id=${this.formId}`;
      this.iframe?.setAttribute('src', frameSource);
    }

    _registerEventListener() {
      window.addEventListener('message', (event: PostmessageEvent) => { 
        if (event.origin !== appConfig.getFrameOrigin()) {
          logger.warn(`Skipping message from ${event.origin}`);
          return;
        }
        /*
        There is some conversion that needs to happen here to make this event not look really messy.
        First, we create a local event (instead of an SSE event), then we use the eventType from the
        payload to determine the kind of event to send. Then we add the id of the event. Then we clear
        out the payload of those values so we don't have duplicates
        */
        const newEvent = new InternalEvent(event.data.eventType);
        newEvent.data = (event.data || {}).data;
        newEvent.id = (event.data || {}).id;
        try {
          delete newEvent.data.isPublic;
          delete newEvent.data.eventType;
          delete newEvent.data.id;
        } catch (err) {
          logger.warn(err);
        }
        this.events.dispatchEvent(newEvent);
      });
    }

    _isValidEventStreamId(id: string) {
      const isValid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return isValid.test(id);
    }
  }

  return MastercardEventStream;
}

export { eventStream_injector };
