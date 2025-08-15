import { baseInputElement_injector } from './BaseInputElement.element';
import { MastercardEventEmitter } from '../../core';
import appConfig from '../../config/app';
import { sleep } from '../../core';
const $inject = {
  appConfig,
  HTMLElement,
  document,
  window,
  MastercardEventEmitter,
  logger: console,
  sleep,
};

export const BaseInputElement = baseInputElement_injector($inject);
export default BaseInputElement;
