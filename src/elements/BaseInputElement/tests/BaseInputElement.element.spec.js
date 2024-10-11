import { expect } from 'chai';
import sinon from 'sinon';
import { baseInputElement_injector as injector } from '../BaseInputElement.element';
import { MastercardEventEmitter } from '../../../core';

describe('elements/BaseInputElement/BaseInputElement.element', () => {
  const sandbox = sinon.createSandbox();
  let $elem, $inject, instance;
  class MockElement {
    constructor() {
      this.style = {};
    }
  }

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
      MastercardEventEmitter,
    };

    $elem = injector($inject);
    instance = new $elem();
    // // Stub out some things we get from the super class
    // instance.generateBaseStyle = sandbox.fake.returns({});
    // instance.emitter = {
    //   emit: sandbox.spy(),
    // };
    // instance.attributeChangedCallback = sandbox.spy();
    // instance.style = {};
    // instance.innerFrame = {
    //   style: {},
    //   setAttribute: sandbox.spy(),
    //   contentWindow: {
    //     postMessage: sandbox.spy(),
    //   },
    // };
  });
  afterEach(() => {
    sandbox.reset();
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
  describe('attributeChangedCallback method', () => {
    beforeEach(() => {
      instance.render = sandbox.spy();
    });
    it('should set the element id and form id', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.attributeChangedCallback('id', 'old-id', 'new-id');
      instance.attributeChangedCallback('form-id', 'old-id', 'new-id');
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
      instance.attributeChangedCallback('id', 'old-id', 'new-id');
      instance.attributeChangedCallback('form-id', 'old-id', 'new-id');
      expect(instance.render.called).to.be.true;
    });
  });
  describe('generateOuterStyle', () => {
    it('should remove vendor prefixed styles', () => {
      const generatedStyle = {
        '-vendor': 'prefixed should be removed',
        'font-family': 'should not be removed',
      };
      let mockStyleOutput = {};
      instance.generateOuterStyle(generatedStyle, mockStyleOutput);
      expect(mockStyleOutput)
        .to.haveOwnProperty('font-family')
        .and.to.eq('should not be removed');
      expect(mockStyleOutput).to.not.haveOwnProperty('-vendor');
    });
  });
  describe('generateBaseStyle method', () => {
    it('should return the auto generated styles', () => {
      const mockStyle = {
        backgroundColor: 'blue',
        color: 'red',
        fontFamily: 'Comic Sans',
      };
      $inject.window.getComputedStyle = sandbox.fake.returns(mockStyle);
      const mockElement = new MockElement();
      const style = instance.generateBaseStyle(mockElement);
      expect(style).to.have.keys(['backgroundColor', 'color', 'fontFamily']);
    });
    it('appends classes to the mock element', () => {
      instance.classList = ['class1', 'class2'];
      $inject.window.getComputedStyle = sandbox.fake.returns({});
      const mockElement = new MockElement();
      instance.generateBaseStyle(mockElement);
      expect(mockElement.classList.add.calledWith('class1')).to.be.true;
      expect(mockElement.classList.add.calledWith('class2')).to.be.true;
    });
  });
});
