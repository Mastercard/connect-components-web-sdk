import { appConfig_injector } from './app.config';
const $inject = {
  APP_SDK_BASE: process.env.APP_SDK_BASE || 'https://components.finicity.com',
};

export default appConfig_injector($inject);