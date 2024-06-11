import { expect } from 'chai';
import sinon from 'sinon';
import { mastercardInput_injector as injector } from '../MastercardInput.element';
import { sleep, MastercardEventEmitter } from '../../../core';

describe('elements/MastercardInput/MastercardInput.element', () => {
  const sandbox = sinon.createSandbox();
  let $elem, $inject, instance;
  class MockElement {
    constructor() {
      this.style = {};
    }
  }

  let sleepSpy;
  before(() => {
    sleepSpy = sandbox.spy(sleep);
  });

  beforeEach(() => {
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
        sdkBase: 'http://mock.local',
        frameOrigin: 'mock.local',
      },
      BaseInputElement: MockElement,
      sleep: sleepSpy,
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
      },
      MastercardEventEmitter,
    };

    $elem = injector($inject);
    instance = new $elem();
    // Stub out some things we get from the super class
    instance.generateBaseStyle = sandbox.fake.returns({});
    instance.emitter = {
      emit: sandbox.spy(),
    };
    instance.attributeChangedCallback = sandbox.spy();
    instance.style = {};
    instance.innerFrame = {
      style: {},
      setAttribute: sandbox.spy(),
      contentWindow: {
        postMessage: sandbox.spy(),
      },
    };
    instance.generateOuterStyle = sandbox.fake.returns({});
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
  describe('connectedCallback method', () => {
    it('should append an iframe', () => {
      instance.connectedCallback();
      expect(instance.appendChild.calledWith(instance.innerFrame)).to.be.true;
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
  });
  describe('generateAutoStyleObject method', () => {
    beforeEach(() => {
      instance.isConnected = true;
    });
    it('should create a mock element', () => {
      instance.generateAutoStyleObject();
      expect($inject.document.createElement.calledWith('input')).to.be.true;
    });
  });
  describe('generateInnerStyleObject method', () => {
    it('should filter values that are not to be applied to the inner frame', () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'black',
        fontFamily: 'Gill Sans',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '2px',
        margin: '100px',
      };
      const response = instance.generateInnerStyleObject(mockStyle);
      expect(response).to.have.keys([
        'backgroundColor',
        'color',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
      ]);
    });
  });
  describe('registerInputEvents method', () => {
    let eventHandler;
    beforeEach(() => {
      // for some reason, this isn't getting added when we test
      instance.emit = sandbox.spy();
      instance.registerInputEvents();
      eventHandler = $inject.window.addEventListener.getCall(0).args[1];
    });
    it('should exit if the origin is incorrect', () => {
      const mockEvent = {
        origin: 'something unexpected',
        data: {
          messageType: 'inputReady',
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
          data: { messageType: 'inputReady' },
        };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('ready');
      });
    });
    describe('inputBlur event', () => {
      it('should dispatch a blur event', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { messageType: 'inputBlur' },
        };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('blur');
      });
      it('should ignore messages for other elements', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { messageType: 'inputBlur', elementId: 'wrong' },
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
          data: { messageType: 'inputFocus' },
        };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('focus');
      });
      it('should ignore messages for other elements', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = {
          origin: 'mock.local',
          data: { messageType: 'inputFocus', elementId: 'wrong' },
        };
        eventHandler(mockEvent);
        expect(instance.emitter.emit.called).to.be.false;
      });
    });
  });
});
