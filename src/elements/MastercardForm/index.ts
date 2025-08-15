import { mastercardForm_injector } from './MastercardForm.element';
import appConfig from '../../config/app';
import EventStream from '../EventStream';
const $inject = {
  appConfig,
  crypto,
  HTMLElement,
  EventStream,
  MutationObserver,
  logger: console,
};

export default mastercardForm_injector($inject);
