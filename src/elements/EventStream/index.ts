import { eventStream_injector } from './EventStream.element';
import appConfig from '../../config/app';

const $inject = {
  appConfig,
  // From global browser scope
  HTMLElement,
  document,
  window,
  logger: console,
};

export const EventStream = eventStream_injector($inject);
export default EventStream;
