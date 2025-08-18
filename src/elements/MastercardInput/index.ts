import appConfig from '../../config/app';
import BaseInputElement from '../BaseInputElement/index';
import { mastercardInput_injector } from './MastercardInput.element';
import { sleep } from '../../core';

const $inject = {
  appConfig,
  BaseInputElement,
  sleep,
  window,
  document,
  logger: console,
};

export const MastercardInput = mastercardInput_injector($inject);
export default MastercardInput;
