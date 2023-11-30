import mastercardFormInjector from './MastercardForm.element';
import { appConfig } from '../../config/app.config';

const $inject = {
  appConfig,
  crypto,
  HTMLElement,
};

export default mastercardFormInjector($inject);
