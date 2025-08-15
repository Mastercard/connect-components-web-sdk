import {MastercardEventEmitter} from '../../core';
import Sleep from '../../core/Sleep';
import BaseInputElement from '../BaseInputElement';
import {AppConfig} from '../../config/types';

export type ElementImports = {
  appConfig: AppConfig,
  BaseInputElement: typeof BaseInputElement,
  sleep: typeof Sleep,
  document: Document,
  window: Window,
  logger: Console,
  MastercardEventEmitter: typeof MastercardEventEmitter,
}