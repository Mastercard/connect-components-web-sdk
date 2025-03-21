import { expect } from 'chai';
import { appConfig_injector as injector } from '../app.config';

describe('config/app.config', () => {
  let $inject;
  beforeEach(() => {
    $inject = {
      APP_SDK_BASE: ''
    };
  });

  it('throws an error if the base url is invalid', () => {
    $inject.APP_SDK_BASE = 'not-a-url';
    expect(injector.bind(this, $inject)).to.throw;
  });

  it('sets the host', () => {
    $inject.APP_SDK_BASE = 'http://localhost:3001/mock-base';
    let config = injector($inject);
    expect(config).to.haveOwnProperty('sdkBase').and
      .to.eq('http://localhost:3001/mock-base')
  });

  it('sets the frame origin', () => {
    $inject.APP_SDK_BASE = 'http://localhost:3001/mock-base';
    let config = injector($inject);
    expect(config).to.haveOwnProperty('frameOrigin').and
      .to.eq('http://localhost:3001');
  });
});