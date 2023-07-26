import mastercardInputInjector from './MastercardInput.element';
import appConfig from '../../config/app.config';

const $inject = {
  appConfig,
  HTMLElement,
};

export default mastercardInputInjector($inject);
