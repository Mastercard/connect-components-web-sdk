import eventStreamInjector from './EventStream.element';
import { appConfig } from '../../config/app.config';

const $inject = {
  appConfig,
  // From global browser scope
  HTMLElement,
  logger: console
};

export default eventStreamInjector($inject);
