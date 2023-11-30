import { appConfig } from '../../config/app.config';
import mastercardMfaChoice_injector from './MastercardMFAChoice.element';
import { sleep, MastercardEventEmitter } from '../../core';

const $inject = {
  appConfig,
  HTMLElement,
  sleep,
  document,
  window,
  logger: console,
  MastercardEventEmitter
};
// @ts-ignore
export default mastercardMfaChoice_injector($inject);