import { expect } from 'chai';
import sinon from 'sinon';
import { mastercardForm_injector as injector } from '../MastercardForm.element';
import { randomUUID } from 'crypto';

describe('elements/MastercardForm/MastercardForm.service', () => {
  const sandbox = sinon.createSandbox();

  let $elem, $inject, instance;
  class MockElement {
    constructor() {
      this.style = {};
    }
  }
  MockElement.prototype.getAttribute = sandbox.fake.returns(true);
  MockElement.prototype.setAttribute = sandbox.spy();
  MockElement.prototype.querySelectorAll = sandbox.fake.returns([]);
  MockElement.prototype.querySelector = sandbox.fake.returns(new MockElement());
  MockElement.prototype.appendChild = sandbox.fake.returns(true);

  class MockObserver {
    constructor(callback) {
      this.cb = callback;
    }
  }
  MockObserver.prototype.observe = sandbox.spy();
  // Allows us to fire this off for testing
  MockObserver.prototype._trigger = function () {
    this.cb();
  };

  beforeEach(() => {
    $inject = {
      appConfig: {
        sdkBase: 'mock',
      },
      crypto: {
        randomUUID,
      },
      HTMLElement: MockElement,
      logger: {
        warn: sandbox.spy(),
      },
      document: {
        createElement: sandbox.spy(function () {
          return new MockElement();
        }),
      },
      MutationObserver: MockObserver,
    };

    $elem = injector($inject);
    instance = new $elem();
  });
  afterEach(() => {
    sandbox.reset();
  });

  describe('connectedCallback method', () => {
    it('should use an existing event stream if it exists', () => {
      const mockEventStream = {};
      instance.querySelector = sandbox.fake.returns(mockEventStream);
      instance.connectedCallback();
      expect(instance.eventStream).to.eq(mockEventStream);
    });
    it('should create a new event stream if the stream id is set', () => {
      instance.querySelector = sandbox.fake.returns(null);
      instance.getAttribute = sandbox.fake.returns('mock-stream-id');
      instance.connectedCallback();
      expect(
        $inject.document.createElement.calledWith('mastercard-event-stream')
      ).to.be.true;
      expect(
        instance.eventStream.setAttribute.calledWith(
          'event-stream-id',
          'mock-stream-id'
        )
      ).to.be.true;
    });
    it('should not create an event stream if there is no id', () => {
      instance.querySelector = sandbox.fake.returns(null);
      instance.getAttribute = sandbox.fake.returns(null);
      instance.connectedCallback();
      expect(instance.eventStream).to.be.null;
    });
    it('should create a mutation observer and start observing', () => {
      instance.connectedCallback();
      expect(instance.observer.observe.called).to.be.true;
    });

    describe('mutation observer', () => {
      it('should set the form id for all child inputs that are not already set', () => {
        instance.getAttribute = sandbox.fake.returns('this-form-id');
        const elementSetAttribute = sandbox.spy();
        const mockInputs = [
          {
            getAttribute: function () {
              return 'does not match';
            },
            setAttribute: elementSetAttribute,
          },
          {
            getAttribute: function () {
              return 'this-form-id';
            },
            setAttribute: elementSetAttribute,
          },
        ];
        instance.querySelectorAll = sandbox.fake.returns(mockInputs);
        instance.connectedCallback();
        instance.observer._trigger();
        expect(instance.querySelectorAll.calledWith('mastercard-input')).to.be
          .true;
        expect(elementSetAttribute.callCount).to.eq(4);
      });
    });
  });
  describe('onSubmit method', () => {
    let mockEvent;
    beforeEach(() => {
      mockEvent = {
        preventDefault: sandbox.spy(),
      };
      instance.onSubmit(mockEvent);
    });
    it('should prevent the default behavior', () => {
      instance.onSubmit(mockEvent);
      expect(mockEvent.preventDefault.called).to.be.true;
    });
    it('should call instance submit method', () => {
      instance.submit = sandbox.spy();
      instance.onSubmit(mockEvent);
      expect(instance.submit.called).to.be.true;
    });
  });
  describe('submit method', () => {
    let mockIframe;
    beforeEach(() => {
      mockIframe = {
        contentWindow: {
          postMessage: sandbox.spy(),
        },
      };
    });
    it('should not do anything if there is no event stream', () => {
      instance.eventStream = null;
      instance.submit();
      expect(mockIframe.contentWindow.postMessage.called).to.be.false;
    });
    it('should fire off event if there is an event stream', () => {
      instance.eventStream = {
        querySelector: sandbox.fake.returns(mockIframe),
        getAttribute: sandbox.fake.returns('123456'),
      };
      instance.submit();
      expect(mockIframe.contentWindow.postMessage.called).to.be.true;
    });
  });
});
