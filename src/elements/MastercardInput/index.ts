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

export default mastercardInput_injector($inject);
