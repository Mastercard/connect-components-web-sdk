import { expect } from 'chai';
import { appConfig_injector as injector } from '../app.config';

describe('config/app.config', () => {
  let $inject;
  beforeEach(() => {
    $inject = {
      APP_SDK_BASE: '',
    };
  });

  it('throws an error if the base url is invalid', () => {
    $inject.APP_SDK_BASE = 'not-a-url';
    expect(injector.bind(this, $inject)).to.throw;
  });

  it('sets the host', () => {
    $inject.APP_SDK_BASE = 'http://localhost:3001/mock-base';
    let config = injector($inject);
    expect(config.getSDKBase()).to.to.eq('http://localhost:3001/mock-base');
  });

  it('sets the frame origin', () => {
    $inject.APP_SDK_BASE = 'http://localhost:3001/mock-base';
    let config = injector($inject);
    expect(config.getFrameOrigin()).to.eq('http://localhost:3001');
  });

  describe('setSdkBase', () => {
    it('should update the SDK base', () => {
      let config = injector($inject);
      config.setSDKBase('http://new-base.com');
      expect(config.getSDKBase()).to.eq('http://new-base.com');
    });
  });
  describe('getSDKBase', () => {
    it('should strip out trailing slashed', () => {
      let config = injector($inject);
      config.setSDKBase('http://new-base.com/');
      expect(config.getSDKBase()).to.eq('http://new-base.com');
    });
    it('should return the default if nothing has been set', () => {
      $inject.APP_SDK_BASE = 'http://localhost:3001/mock-base';
      let config = injector($inject);
      expect(config.getSDKBase()).to.eq('http://localhost:3001/mock-base');
    });
  });
  describe('getFrameOrigin', () => {
    it('should return the origin of the sdkBase', () => {
      let config = injector($inject);
      config.setSDKBase('http://new-base.com/');
      expect(config.getFrameOrigin()).to.eq('http://new-base.com');
    });
    it('should return the default if nothing has been set', () => {
      $inject.APP_SDK_BASE = 'http://localhost:3001/mock-base';
      let config = injector($inject);
      expect(config.getFrameOrigin()).to.eq('http://localhost:3001');
    });
  });
});