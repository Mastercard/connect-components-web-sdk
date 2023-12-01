import { mastercardForm_injector } from './MastercardForm.element';
import appConfig from '../../config/app';

const $inject = {
  appConfig,
  crypto,
  HTMLElement,
};

export default mastercardForm_injector($inject);
