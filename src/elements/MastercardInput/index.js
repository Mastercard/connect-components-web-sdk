import appConfig from '../../config/app.config';
import mastercardInputInjector from './MastercardInput.element';
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
export default mastercardInputInjector($inject);
