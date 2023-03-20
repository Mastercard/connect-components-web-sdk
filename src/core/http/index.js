import appConfig from '../../config/app.config';

const $inject = {
  fetch: window.fetch,
  appConfig: appConfig
};

import httpInjector from './http';
export default httpInjector($inject);
