import { expect } from 'chai';
import sinon from 'sinon';
import { baseInputElement_injector as injector } from '../BaseInputElement.element';
import { sleep } from '../../../core';

describe('elements/BaseInputElement/BaseInputElement.element', () => {
  const sandbox = sinon.createSandbox();
  let $elem, $inject, instance;
  class MockElement {
    constructor() {
      this.style = {};
    }
  }
  // Emitter mocks
  let mockEmit, mockOn, mockOff;
  let sleepSpy;
  before(() => {
    sleepSpy = sandbox.spy(sleep);
  });

  beforeEach(() => {
    mockEmit = sandbox.spy();
    mockOn = sandbox.spy();
    mockOff = sandbox.spy();

    MockElement.prototype.getAttribute = sandbox.fake.returns(true);
    MockElement.prototype.setAttribute = sandbox.spy();
    MockElement.prototype.querySelectorAll = sandbox.fake.returns([]);
    MockElement.prototype.querySelector = sandbox.fake.returns(
      new MockElement()
    );
    MockElement.prototype.appendChild = sandbox.fake.returns(true);
    MockElement.prototype.append = sandbox.fake.returns(true);
    MockElement.prototype.removeChild = sandbox.fake.returns(true);
    MockElement.prototype.classList = [];
    MockElement.prototype.style = {};
    MockElement.prototype.classList.add = sandbox.spy();
    MockElement.prototype.classList.remove = sandbox.spy();
    MockElement.prototype.parentElement = {
      append: sandbox.spy(),
      removeChild: sandbox.spy(),
    };
    MockElement.prototype.contentWindow = {
      postMessage: sandbox.spy(),
    };

    $inject = {
      appConfig: {
        getSDKBase: () => 'http://mock.local',
        getFrameOrigin: () => 'mock.local',
      },
      HTMLElement: MockElement,
      window: {
        getComputedStyle: sandbox.fake.returns({}),
        btoa: sandbox.fake.returns('base64 data'),
        addEventListener: sandbox.spy(),
      },
      document: {
        createElement: sandbox.spy(function () {
          return new MockElement();
        }),
      },
      logger: {
        warn: sandbox.spy(),
        error: sandbox.spy(),
      },
      sleep: sleepSpy,
      MastercardEventEmitter: function () {
        return {
          emit: mockEmit,
          on: mockOn,
          off: mockOff,
        };
      },
    };

    $elem = injector($inject);
    instance = new $elem();
  });
  afterEach(() => {
    sandbox.reset();
  });
  describe('observedAttributes static method', () => {
    it('returns a list of observable attributes', () => {
      expect($elem.observedAttributes)
        .to.be.an('array')
        .and.to.include('id', 'form-id');
    });
  });
  describe('addEventListener method', () => {
    it('adds a listener to the emitter', () => {
      instance.emitter.on = sandbox.spy();
      const cb = () => {};
      instance.addEventListener('test', cb);
      expect(instance.emitter.on.calledWith('test', cb)).to.be.true;
    });
  });
  describe('removeEventListener method', () => {
    it('removes a listener from the emitter', () => {
      instance.emitter.off = sandbox.spy();
      const cb = () => {};
      instance.removeEventListener('test', cb);
      expect(instance.emitter.off.calledWith('test', cb)).to.be.true;
    });
  });
  describe('connectedCallback method', () => {
    it('should append an iframe', () => {
      instance.connectedCallback();
      expect(instance.appendChild.calledWith(instance.innerFrame)).to.be.true;
    });
    it('should register input events', () => {
      instance.registerInputEvents = sandbox.spy();
      instance.connectedCallback();
      expect(instance.registerInputEvents.called).to.be.true;
    });
  });
  describe('attributeChangedCallback method', () => {
    beforeEach(() => {
      instance.render = sandbox.spy();
    });
    it('should set the style', () => {
      instance.attributeChangedCallback(
        'component-styles',
        null,
        'new style object'
      );
      expect(instance.componentStyles).to.eq('new style object');
    });
    it('should set the element id and form id', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.attributeChangedCallback('id', 'old-id', 'new-id');
      instance.attributeChangedCallback('form-id', 'old-id', 'new-id');
      // Update: We are reading from the new value passed in, not the value returned on getAttribute
      expect(instance.elemId).to.eq('new-id');
      expect(instance.formId).to.eq('new-id');
    });
    it('should exit if the form id and element id are not set', () => {
      instance.getAttribute = sandbox.fake.returns(null);
      instance.innerFrame = {};
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.false;
    });
    it('should exit if the inner frame is not set', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = null;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.false;
    });
    it('should not render if element is not connected to the DOM', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.isConnected = false;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.false;
    });
    it('should not render if values have not changed', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.isConnected = true;
      instance.formId = 1234;
      instance.attributeChangedCallback('id', 'val1', 'val2');
      instance.attributeChangedCallback('id', 'val2', 'val2');
      instance.attributeChangedCallback('id', 'val2', 'val2');

      expect(instance.render.callCount).to.eq(1);
    });
    it('should render otherwise', () => {
      instance.render = sandbox.spy();
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.frameReady = true;
      instance.isConnected = true;
      instance.attributeChangedCallback('id', 'old-id', 'new-id');
      instance.attributeChangedCallback('form-id', 'old-id', 'new-id');
      expect(instance.render.called).to.be.true;
    });
  });
  describe('render method', () => {
    it('should sleep if the component is not connected', async () => {
      instance.isConnected = false;
      instance.frameReady = true;
      setTimeout(() => {
        instance.isConnected = true;
      }, 10);
      await instance.render();
      expect($inject.sleep.called).to.be.true;
    });
    it('should log an error if posting a message fails', async () => {
      instance.innerFrame.contentWindow.postMessage = sandbox.fake.throws(
        new Error('mock')
      );
      instance.isConnected = true;
      instance.frameReady = true;
      await instance.render();
      expect($inject.logger.error.called).to.be.true;
    });
  });
  describe('registerInputEvents method', () => {
    let eventHandler;
    beforeEach(() => {
      instance.registerInputEvents();
      eventHandler = $inject.window.addEventListener.getCall(0).args[1];
    });
    it('should exit if the origin is incorrect', () => {
      const mockEvent = {
        origin: 'something unexpected',
        data: {
          eventType: 'inputReady',
        },
      };
      eventHandler(mockEvent);
      expect($inject.logger.warn.called).to.be.true;
    });
    describe('inputReady event', () => {
      it('should call render and dispatch a ready event', () => {
        instance.emitter.emit = sandbox.spy();
        instance.render = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { eventType: 'inputReady' },
        };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('ready');
      });
    });
    describe('inputBlur event', () => {
      it('should dispatch a blur event', () => {
        // instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { eventType: 'inputBlur', elementId: null },
        };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('blur');
      });
      it('should ignore messages for other elements', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { eventType: 'inputBlur', elementId: 'wrong' },
        };
        eventHandler(mockEvent);
        expect(instance.emitter.emit.called).to.be.false;
      });
    });
    describe('inputFocus event', () => {
      it('should dispatch a blur event', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { eventType: 'inputFocus', elementId: null },
        };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('focus');
      });
      it('should ignore messages for other elements', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { eventType: 'inputFocus', elementId: 'wrong' },
        };
        eventHandler(mockEvent);
        expect(instance.emitter.emit.called).to.be.false;
      });
    });
  });
});
