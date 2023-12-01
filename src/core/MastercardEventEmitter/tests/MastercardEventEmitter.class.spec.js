import { expect } from 'chai';
import sinon from 'sinon';
import { mastercardEventEmitter_injector as injector } from '../MastercardEventEmitter.class';

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
    it('should not re-register duplicate event+callbacks', (done) => {
      let callCount = 0;
      const callback = function (data) {
        callCount++;
      }
      instance.on('test', callback);
      instance.on('test', callback);
      // This should now trigger twice
      instance.emit('test', { mock: 'data' });
      setTimeout(() => {
        expect(callCount).to.eq(1);
        done();
      }, 500);
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
    it('unregisters all instances of a callback+event combination', (done) => {
      const callback = function () {
        done(new Error('We should not have gotten here'));
      }
      // Register two instances with the same callback, then unregister. This should
      // remove _both_ of them
      instance.on('test', callback);
      instance.on('test', callback);
      instance.off('test', callback);
      instance.emit('test', {});
      setTimeout(() => {
        done();
      }, 100);
    });
    it('ignores events that have not been registered', (done) => {
      const callback = function () {
        // This should still get called because we've unregsitered a different
        // event+callback combo
        done();
      }
      // Register two instances with the same callback, then unregister. This should
      // remove _both_ of them
      instance.on('test', callback);
      instance.off('test2', callback);
      instance.emit('test', {});
    });
  });
});