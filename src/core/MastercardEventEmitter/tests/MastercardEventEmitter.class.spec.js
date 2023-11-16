import { expect } from 'chai';
import sinon from 'sinon';
import injector from '../MastercardEventEmitter.class';

describe('core/MastercardEventEmitter/MastercardEventEmitter.class', () => {
  const sandbox = sinon.createSandbox();
  let instance;

  beforeEach(() => {
    const mastercardEmitterClass = injector();
    instance = new mastercardEmitterClass();
  });
  afterEach(() => {
    sandbox.reset();
  });
  describe('event emitter', () => {
    it('registeres events', (done) => {
      const callback = function (data) {
        expect(data).to.haveOwnProperty('mock').and.to.eq('data');
        done();
      }
      instance.on('test', callback);
      instance.emit('test', { mock: 'data' });
    });
    it('unregisteres events', (done) => {
      const callback1 = function (data) {
        expect(data).to.haveOwnProperty('mock').and.to.eq('data');
        done();
      }
      const callback2 = function () {
        // it's bad here
        done(new Error('Should not get here'));
      }
      instance.on('test', callback2);
      instance.on('test1', callback1);
      instance.off('test', callback2);
      instance.emit('test1', { mock: 'data' });
    });
  });
});