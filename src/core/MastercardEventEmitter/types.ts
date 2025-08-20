export interface MastercardEventEmitterInterface {
  _emitter: EventTarget;
  _eventData: WeakMap<object, any>;
  _callbacks: Map<any, any>;
  on(eventName: string, callback: (eventData: any) => void): void;
  off(eventName: string, callback: (eventData: any) => void): void;
  emit(eventName: string, eventData: any): void;
}