import injector from './app.config';
const $inject = {
  APP_SDK_BASE: process.env.APP_SDK_BASE || 'http://localhost:3001'
}

export default injector($inject);