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

export default eventStream_injector($inject);
