export type MastercardEventEmitter = {
  on(eventName: string, callback: Function): void;
  off(eventName: string, callback: Function): void;
  emit(eventName: string, eventData: any): void;
}