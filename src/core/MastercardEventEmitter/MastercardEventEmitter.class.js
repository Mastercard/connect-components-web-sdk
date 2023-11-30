function mastercardEventEmitter_injector() {
  /** @type {import('./types').MastercardEventEmitter} */
  return class MastercardEventEmitter {
    constructor () {
      this._emitter = new EventTarget();
      this._eventData = new WeakMap();
      this._callbacks = new Map();
    }
    /** @type {import('./types').MastercardEventEmitter['on']} */
    on(eventName, callback) {
      const proxiedEventHandler = (/** @type {object} */ event) => {
        callback(this._eventData.get(event));
      }
      if (!this._callbacks.has(eventName)) {
        this._callbacks.set(eventName, new WeakMap());
      }
      // This is so we can look up the actual event handler when calling .off
      this._callbacks.get(eventName).set(callback, proxiedEventHandler);
      this._emitter.addEventListener(eventName, proxiedEventHandler);
    }

    /** @type {import('./types').MastercardEventEmitter['off']} */
    off(eventName, callback) {
      const proxiedEventHandler = this._callbacks.get(eventName)?.get(callback);
      if (proxiedEventHandler) {
        this._emitter.removeEventListener(eventName, proxiedEventHandler);
        this._callbacks.get(eventName)?.delete(callback);
      }
    }

    /** @type {import('./types').MastercardEventEmitter['emit']} */
    emit(eventName, eventData) {
      const newEvent = new Event(eventName);
      this._eventData.set(newEvent, eventData);
      this._emitter.dispatchEvent(newEvent);
    }
  }
}
export default mastercardEventEmitter_injector;