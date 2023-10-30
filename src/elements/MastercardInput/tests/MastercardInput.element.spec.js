import { expect } from 'chai';
import sinon from 'sinon';
import injector from '../MastercardInput.element';
import { sleep } from '../../../core';

describe('elements/MastercardInput/MastercardInput.element', () => {
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
    // The fact that we can do this proves javascript is weird
    MockElement.prototype.classList = [];
    MockElement.prototype.classList.add = sandbox.spy();
    MockElement.prototype.classList.remove = sandbox.spy();
    MockElement.prototype.parentElement = new MockElement();
    MockElement.prototype.contentWindow = {
      postMessage: sandbox.spy()
    }

    $inject = {
      appConfig: {
        sdkBase: 'mock'
      },
      HTMLElement: MockElement,
      sleep: sandbox.spy(sleep),
    };

    global.document = {
      createElement: sandbox.spy(function () {
        return new MockElement();
      })
    };
    global.window = {
      getComputedStyle: sandbox.fake.returns({}),
      btoa: sandbox.fake.returns('base64 data'),
      addEventListener: sandbox.spy()
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
    it('should sleep if the component is not connected', (done) => {
      instance.isConnected = false;
      setTimeout(() => {
        instance.isConnected = true;
      }, 500);
      instance.render().finally(() => {
        expect($inject.sleep.called).to.be.true;
        done();
      });
    });
    it('should refresh the inner iframe if the style for that frame has changed', async () => {
      await instance.render();
      expect(instance.innerFrame.contentWindow.postMessage.callCount).to.eq(1);
    });
  });
  describe('generateOuterStyle', () => {
    it('should remove vendor prefixed styles', () => {
      const generatedStyle = {
        '-vendor': 'prefixed should be removed',
        'font-family': 'should not be removed'
      };
      const response = instance.generateOuterStyle(generatedStyle);
      expect(response).to.haveOwnProperty('font-family').and.to.eq('should not be removed');
      expect(response).to.not.haveOwnProperty('-vendor');
    });
  });
  describe('generateAutoStyleObject method', () => {
    beforeEach(() => {
      instance.isConnected = true;
    });
    it('should create a mock element', () => {
      instance.generateAutoStyleObject();
      expect(global.document.createElement.calledWith('input')).to.be.true;
    });
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      global.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateAutoStyleObject();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should return the auto generated styles', async () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans'
      }
      global.window.getComputedStyle = sandbox.fake.returns(mockStyle);
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
      instance.scheduledRender = false;
      instance.isConnected = false;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.false;
    });
    it('should re-render if the class list changes', () => {
      instance.styleStrategy = sandbox.spy();
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.scheduledRender = false;
      instance.isConnected = true;
      instance.attributeChangedCallback('class');
      expect(instance.render.called).to.be.true;
    });
    it('should render otherwise', () => {
      instance.render = sandbox.spy();
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.scheduledRender = false;
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
      instance.registerInputEvents();
      eventHandler = global.window.addEventListener.getCall(0).args[1];
    });
    describe('inputReady event', () => {
      it('should call render and dispatch a ready event', (done) => {
        instance.render = sandbox.spy();
        instance._eventTarget.addEventListener('ready', () => {
          expect(instance.render.called).to.be.true;
          done();
        });
        const mockEvent = { data: { messageType: 'inputReady' } };
        eventHandler(mockEvent);
      });
    });
    describe('inputBlur event', () => {
      it('should dispatch a blur event', (done) => {
        instance._eventTarget.addEventListener('blur', () => {
          done();
        });
        const mockEvent = { data: { messageType: 'inputBlur' } };
        eventHandler(mockEvent);
      });
    });
    describe('inputFocus event', () => {
      it('should dispatch a blur event', (done) => {
        instance._eventTarget.addEventListener('focus', () => {
          done();
        });
        const mockEvent = { data: { messageType: 'inputFocus' } };
        eventHandler(mockEvent);
      });
    });
  });
});