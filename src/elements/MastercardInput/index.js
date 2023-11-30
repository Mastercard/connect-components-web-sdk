import mastercardInputInjector from './MastercardInput.element';
import { appConfig } from '../../config/app.config';
import { sleep } from '../../core';

const $inject = {
  appConfig,
  HTMLElement,
  sleep,
};

export default mastercardInputInjector($inject);
