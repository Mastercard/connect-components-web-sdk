import { baseInputElement_injector } from './BaseInputElement.element';
import { MastercardEventEmitter } from '../../core';

const $inject = {
  HTMLElement,
  document,
  window,
  MastercardEventEmitter,
};
// @ts-ignore
export default baseInputElement_injector($inject);
