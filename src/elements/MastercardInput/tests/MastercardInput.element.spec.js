import { expect } from 'chai';
import sinon from 'sinon';
import injector from '../MastercardInput.element';
import { sleep, MastercardEventEmitter } from '../../../core';

describe('elements/MastercardInput/MastercardInput.element', () => {
  const sandbox = sinon.createSandbox();
  let $elem, $inject, instance;
  class MockElement {
    constructor () {
      this.style = {}
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
    MockElement.prototype.querySelector = sandbox.fake.returns(new MockElement());
    MockElement.prototype.appendChild = sandbox.fake.returns(true);
    MockElement.prototype.append = sandbox.fake.returns(true);
    MockElement.prototype.removeChild = sandbox.fake.returns(true);
    MockElement.prototype.classList = [];
    MockElement.prototype.style = {};
    MockElement.prototype.classList.add = sandbox.spy();
    MockElement.prototype.classList.remove = sandbox.spy();
    MockElement.prototype.parentElement = {
      append: sandbox.spy(),
      removeChild: sandbox.spy()
    };
    MockElement.prototype.contentWindow = {
      postMessage: sandbox.spy()
    };

    $inject = {
      appConfig: {
        sdkBase: 'http://mock.local',
        frameOrigin: 'mock.local'
      },
      HTMLElement: MockElement,
      sleep: sleepSpy,
      window: {
        getComputedStyle: sandbox.fake.returns({}),
        btoa: sandbox.fake.returns('base64 data'),
        addEventListener: sandbox.spy()
      },
      document: {
        createElement: sandbox.spy(function () {
          return new MockElement();
        })
      },
      logger: {
        warn: sandbox.spy()
      },
      MastercardEventEmitter
    };

    $elem = injector($inject);
    instance = new $elem();
  });
  afterEach(() => {
    sandbox.reset();
  });
  describe('observedAttributes static method', () => {
    it('returns a list of observable attributes', () => {
      expect($elem.observedAttributes).to.be.an('array').and
        .to.include('id', 'form-id');
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
  describe('generateOuterStyle', () => {
    it('should remove vendor prefixed styles', () => {
      const generatedStyle = {
        '-vendor': 'prefixed should be removed',
        'font-family': 'should not be removed'
      };
      let mockStyleOutput = {}
      instance.generateOuterStyle(generatedStyle, mockStyleOutput);
      expect(mockStyleOutput).to.haveOwnProperty('font-family').and.to.eq('should not be removed');
      expect(mockStyleOutput).to.not.haveOwnProperty('-vendor');
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
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      $inject.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateAutoStyleObject();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should return the auto generated styles', async () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans'
      }
      $inject.window.getComputedStyle = sandbox.fake.returns(mockStyle);
      const style = await instance.generateAutoStyleObject();
      expect(style).to.have.keys(['backgroundColor', 'color', 'fontFamily']);
    });
    it('should remove the mock element when done', () => {
      instance.generateAutoStyleObject();
      expect(instance.parentElement.removeChild.called).to.be.true;
    });
  });
  describe('attributeChangedCallback method', () => {
    beforeEach(() => {
      instance.render = sandbox.spy();
    })
    it('should set the element id and form id', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.attributeChangedCallback('id');
      expect(instance.elemId).to.eq('mock-attr');
      expect(instance.formId).to.eq('mock-attr');
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
    it('should render otherwise', () => {
      instance.render = sandbox.spy();
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.frameReady = true;
      instance.isConnected = true;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.true;
    });
  });
  describe('generateInnerStyleObject method', () => {
    it('should filter values that are not to be applied to the inner frame', () => {
      const mockStyle = {
        'backgroundColor': 'blue',
        'color': 'black',
        'fontFamily': 'Gill Sans',
        'fontSize': '12px',
        'fontWeight': '500',
        'letterSpacing': '2px',
        'margin': '100px'
      }
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
          messageType: 'inputReady'
        }
      };
      eventHandler(mockEvent);
      expect($inject.logger.warn.called).to.be.true;
    });
    describe('inputReady event', () => {
      it('should call render and dispatch a ready event', () => {
        instance.render = sandbox.spy();
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputReady' } };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('ready');
      });
    });
    describe('inputBlur event', () => {
      it('should dispatch a blur event', () => {
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputBlur' } };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('blur');
      });
    });
    describe('inputFocus event', () => {
      it('should dispatch a blur event', () => {
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputFocus' } };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('focus');
      });
    });
  });
});