import { expect } from 'chai';
import sinon from 'sinon';
import injector from '../sleep';

describe('core/Sleep/sleep.js', () => {
  const sandbox = sinon.createSandbox();
  let sleep, $inject;

  beforeEach(() => {
    $inject = {
      Promise
    };
    sleep = injector($inject);
  });

  afterEach(() => {
    sandbox.reset();
  });

  // WARNING -- testing timing functions without a mock timer is risky and might
  // fail without warning!!
  it('should wait the number of milliseconds given', () => {
    let start = Date.now();
    sleep(100).then(() => {
      expect(Date.now() - start).to.eq(100);
    });
  });
  it('should default to 1 millisecond', () => {
    let start = Date.now();
    sleep().then(() => {
      expect(Date.now() - start).to.eq(1);
    });
  });
})
