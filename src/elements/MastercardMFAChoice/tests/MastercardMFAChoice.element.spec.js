import { expect } from 'chai';
import { sleep, MastercardEventEmitter } from '../../../core';
import sinon from 'sinon';
import injector from '../MastercardMFAChoice.element';

describe('elements/MastercardMFAChoice/MastercardMFAChoice.element', () => {
  const sandbox = sinon.createSandbox();

  let $elem, $inject, instance;
  class MockElement {
    constructor () {
      this.style = {}
    }
  }

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
      sleep: sandbox.spy(sleep),
      document: {
        createElement: sandbox.spy(function () {
          return new MockElement();
        })
      },
      window: {
        getComputedStyle: sandbox.fake.returns({}),
        btoa: sandbox.fake.returns('base64 data'),
        addEventListener: sandbox.spy(),
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

    it('should call registerInputEvents', () => {
      instance.registerInputEvents = sandbox.spy();
      instance.connectedCallback();
      expect(instance.registerInputEvents.called).to.be.true;
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
    it('should exist if the form id and element id are not set', () => {
      instance.getAttribute = sandbox.fake.returns(null);
      instance.innerFrame = {};
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.false;
    });
    it('should exist if the inner frame is not set', () => {
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
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.isConnected = true;
      instance.frameReady = true;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.true;
    });
  });
  describe('render method', () => {
    beforeEach(() => {
      instance.isConnected = true;
      instance.frameReady = true;
    });
    it('should generate styles for mock elements', async () => {
      const mockFn = sandbox.fake.returns({});
      instance.generateInnerStyleObject = mockFn;

      instance.generateInputStyleObject = sandbox.fake.returns({})
      instance.generateRadioStyleObject = sandbox.fake.returns({})
      instance.generateImageStyleObject = sandbox.fake.returns({})
      instance.generateLabelStyleObject = sandbox.fake.returns({})

      await instance.render();
      // One each for text, radio, image, label
      expect(mockFn.callCount).to.eq(4);
      expect(instance.generateInputStyleObject.called).to.be.true;
      expect(instance.generateRadioStyleObject.called).to.be.true;
      expect(instance.generateImageStyleObject.called).to.be.true;
      expect(instance.generateLabelStyleObject.called).to.be.true;
    });
    it('should send the styling to the inner iframe', async () => {
      await instance.render();
      expect(instance.innerFrame.contentWindow.postMessage.called).to.be.true;
    });
    it('should sleep if the element is not connected', async () => {
      instance.isConnected = false;
      instance.frameReady = true;
      setTimeout(() => {
        instance.isConnected = true;
      }, 1);
      await instance.render();
      expect($inject.sleep.called).to.be.true;
    });
    it('should sleep if the frame has not responded as ready', async () => {
      instance.isConnected = true;
      instance.frameReady = false;
      setTimeout(() => {
        instance.frameReady = true;
      }, 1);
      await instance.render();
      expect($inject.sleep.called).to.be.true;
    });
    it('should not sleep if the element is ready', async () => {
      instance.isConnected = true;
      instance.frameReady = true;
      await instance.render();
      expect($inject.sleep.called).to.be.false;
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
          messageType: 'inputReady'
        }
      };
      eventHandler(mockEvent);
      expect($inject.logger.warn.called).to.be.true;
    });
    describe('inputReady event', () => {
      it('should call render and dispatch a ready event', () => {
        instance.emitter.emit = sandbox.spy();
        instance.render = sandbox.spy();
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputReady' } };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('ready');
      });
    });
    describe('inputBlur event', () => {
      it('should dispatch a blur event', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputBlur' } };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('blur');
      });
      it('should ignore messages for other elements', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputBlur', elementId: 'wrong' } };
        eventHandler(mockEvent);
        expect(instance.emitter.emit.called).to.be.false;
      });
    });
    describe('inputFocus event', () => {
      it('should dispatch a blur event', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputFocus' } };
        eventHandler(mockEvent);
        const dispatchedEvent = instance.emitter.emit.getCall(0).args[0];
        expect(dispatchedEvent).to.eq('focus');
      });
      it('should ignore messages for other elements', () => {
        instance.emitter.emit = sandbox.spy();
        const mockEvent = { origin: 'mock.local', data: { messageType: 'inputFocus', elementId: 'wrong' } };
        eventHandler(mockEvent);
        expect(instance.emitter.emit.called).to.be.false;
      });
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
        'margin': '100px',
        'transition': '1s all'
      }
      const response = instance.generateInnerStyleObject(mockStyle);
      expect(response).to.have.keys([
        'backgroundColor',
        'color',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'margin'
      ]);
    });
  });
  describe('generateInputStyleObject method', () => {
    beforeEach(() => {
      instance.isConnected = true;
    });
    it('should create a mock element', () => {
      instance.generateInputStyleObject();
      expect($inject.document.createElement.calledWith('input')).to.be.true;
    });
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      $inject.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateInputStyleObject();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should return the auto generated styles', async () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans'
      }
      $inject.window.getComputedStyle = sandbox.fake.returns(mockStyle);
      const style = await instance.generateInputStyleObject();
      expect(style).to.have.keys(['backgroundColor', 'color', 'fontFamily']);
    });
    it('should remove the mock element when done', () => {
      instance.generateInputStyleObject();
      expect(instance.parentElement.removeChild.called).to.be.true;
    });
  });
  describe('generateRadioStyleObject method', () => {
    beforeEach(() => {
      instance.isConnected = true;
    });
    it('should create a mock element', () => {
      instance.generateRadioStyleObject();
      expect($inject.document.createElement.calledWith('input')).to.be.true;
    });
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      $inject.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateRadioStyleObject();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should return the auto generated styles', async () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans'
      }
      $inject.window.getComputedStyle = sandbox.fake.returns(mockStyle);
      const style = await instance.generateRadioStyleObject();
      expect(style).to.have.keys(['backgroundColor', 'color', 'fontFamily']);
    });
    it('should remove the mock element when done', () => {
      instance.generateRadioStyleObject();
      expect(instance.parentElement.removeChild.called).to.be.true;
    });
  });
  describe('generateImageStyleObject method', () => {
    beforeEach(() => {
      instance.isConnected = true;
    });
    it('should create a mock element', () => {
      instance.generateImageStyleObject();
      expect($inject.document.createElement.calledWith('img')).to.be.true;
    });
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      $inject.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateImageStyleObject();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should return the auto generated styles', async () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans'
      }
      $inject.window.getComputedStyle = sandbox.fake.returns(mockStyle);
      const style = await instance.generateImageStyleObject();
      expect(style).to.have.keys(['backgroundColor', 'color', 'fontFamily']);
    });
    it('should remove the mock element when done', () => {
      instance.generateImageStyleObject();
      expect(instance.parentElement.removeChild.called).to.be.true;
    });
  });
  describe('generateLabelStyleObject method', () => {
    beforeEach(() => {
      instance.isConnected = true;
    });
    it('should create a mock element', () => {
      instance.generateLabelStyleObject();
      expect($inject.document.createElement.calledWith('label')).to.be.true;
    });
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      $inject.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateLabelStyleObject();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should return the auto generated styles', async () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans'
      }
      $inject.window.getComputedStyle = sandbox.fake.returns(mockStyle);
      const style = await instance.generateLabelStyleObject();
      expect(style).to.have.keys(['backgroundColor', 'color', 'fontFamily']);
    });
    it('should remove the mock element when done', () => {
      instance.generateLabelStyleObject();
      expect(instance.parentElement.removeChild.called).to.be.true;
    });
  });
});