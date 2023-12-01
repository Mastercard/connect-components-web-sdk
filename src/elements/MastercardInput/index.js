import appConfig from '../../config/app';
import { mastercardInput_injector } from './MastercardInput.element';
import { sleep, MastercardEventEmitter } from '../../core';

const $inject = {
  appConfig,
  HTMLElement,
  sleep,
  window,
  document,
  logger: console,
  MastercardEventEmitter
};

// @ts-ignore
export default mastercardInput_injector($inject);
