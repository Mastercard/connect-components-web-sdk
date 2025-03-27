import { expect } from 'chai';
import sinon from 'sinon';
import { mastercardInput_injector as injector } from '../MastercardInput.element';

describe('elements/MastercardInput/MastercardInput.element', () => {
  const sandbox = sinon.createSandbox();
  let $elem, $inject, instance;

  beforeEach(() => {
    $inject = {
      appConfig: {
        getSDKBase: () => 'http://mock.local',
        getFrameOrigin: () => 'mock.local',
      },
      BaseInputElement: class BaseInputElement {},
    };

    $elem = injector($inject);
    instance = new $elem();
  });
  afterEach(() => {
    sandbox.reset();
  });
  describe('generateIframeURL', () => {
    it('should return a well formatted URL', () => {
      let url = instance.generateIframeURL(1, 2);
      expect(url).to.eq(
        'http://mock.local/frames/parent/login-forms/1/elements/2/contents.html'
      );
    });
  });
});
