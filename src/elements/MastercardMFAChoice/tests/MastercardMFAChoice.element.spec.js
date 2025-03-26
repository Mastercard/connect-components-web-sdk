import { expect } from 'chai';
import sinon from 'sinon';
import { mastercardMfaChoice_injector as injector } from '../MastercardMFAChoice.element';

describe('elements/MastercardMFAChoice/MastercardMFAChoice.element', () => {
  const sandbox = sinon.createSandbox();

  let $elem, $inject, instance;

  beforeEach(() => {
    $inject = {
      appConfig: {
        sdkBase: 'http://mock.local',
        frameOrigin: 'mock.local',
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
        'http://mock.local/frames/parent/mfa/1/elements/2/contents.html'
      );
    });
  });
});
