import appConfig from '../../config/app';
import { mastercardMfaChoice_injector } from './MastercardMFAChoice.element';
import { sleep, MastercardEventEmitter } from '../../core';
import BaseInputElement from '../BaseInputElement/index';

const $inject = {
  appConfig,
  BaseInputElement,
  sleep,
  document,
  window,
  logger: console,
  MastercardEventEmitter,
};
// @ts-ignore
export default mastercardMfaChoice_injector($inject);
