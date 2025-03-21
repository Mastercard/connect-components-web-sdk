import { mastercardForm_injector } from './MastercardForm.element';
import appConfig from '../../config/app';

const $inject = {
  appConfig,
  crypto,
  HTMLElement,
  document,
  MutationObserver,
  logger: console,
};

export default mastercardForm_injector($inject);
