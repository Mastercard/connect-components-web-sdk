import { MastercardEventEmitterInterface } from "./types";

function mastercardEventEmitter_injector() {
  return class MastercardEventEmitter implements MastercardEventEmitterInterface {
    _emitter: EventTarget;
    _eventData: WeakMap<object, any>;
    _callbacks: Map<any, any>;
 
    constructor () {
      this._emitter = new EventTarget();
      this._eventData = new WeakMap();
      this._callbacks = new Map();
    }
    
    on(eventName: string, callback: (eventData: any) => void): void {
      const proxiedEventHandler = (event: any) => {
        callback(this._eventData.get(event));
      }
      if (!this._callbacks.has(eventName)) {
        this._callbacks.set(eventName, new WeakMap());
      }
      if (this._callbacks.get(eventName).has(callback)) {
        // Don't double register!
        return;
      }
      // This is so we can look up the actual event handler when calling .off
      this._callbacks.get(eventName).set(callback, proxiedEventHandler);
      this._emitter.addEventListener(eventName, proxiedEventHandler);
    }

    off(eventName: string, callback: (eventData: any) => void) {
      const proxiedEventHandler = this._callbacks.get(eventName)?.get(callback);
      if (proxiedEventHandler) {
        this._emitter.removeEventListener(eventName, proxiedEventHandler);
        this._callbacks.get(eventName)?.delete(callback);
      }
    }

    emit(eventName: string, eventData: any): void {
      const newEvent = new Event(eventName);
      this._eventData.set(newEvent, eventData);
      this._emitter.dispatchEvent(newEvent);
    }
  }
}
export { mastercardEventEmitter_injector };