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
      btoa: sandbox.fake.returns('base64 data')
    };
    $elem = injector($inject);
    instance = new $elem();
  });
  afterEach(() => {
    sandbox.reset();
  });
  describe('constructor', () => {
    it('should set the style strategy to "auto"', () => {
      instance.setStyle = sandbox.spy();
      instance.styleStrategy()
      expect(instance.setStyle.calledWithExactly('auto')).to.be.true;
    });
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
      });
      instance.render().finally(() => {
        expect($inject.sleep.called).to.be.true;
        done();
      });
    });
    it('should refresh the inner iframe if the style for that frame has changed', async () => {
      instance.lastEncodedStyle = 'some-encoded-style';
      instance.generateStyleString = sandbox.fake.returns('some-different-encoded-style');
      await instance.render();
      // called once on constructor
      expect(instance.innerFrame.setAttribute.callCount).to.eq(2);
    });
    it('should not refresh the inner iframe if no style changes occurred', async () => {
      instance.lastEncodedStyle = 'some-encoded-style';
      instance.generateStyleString = sandbox.fake.returns('some-encoded-style');
      await instance.render();
      // called once on constructor
      expect(instance.innerFrame.setAttribute.callCount).to.eq(1);
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
    it('should sleep if the component is not connected', (done) => {
      instance.isConnected = false;
      setTimeout(() => {
        instance.isConnected = true;
      });
      instance.generateAutoStyleObject().finally(() => {
        expect($inject.sleep.called).to.be.true;
        done();
      });
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
    it('should not render if one is already scheduled', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.scheduledRender = true;
      instance.isConnected = true;
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
      expect(instance.styleStrategy.called).to.be.true;
    });
    it('should render otherwise', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.scheduledRender = false;
      instance.isConnected = true;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.true;
    });
  });
  describe('setStyle method', () => {
    it('should set automatic styling if no style object provided', async () => {
      instance.generateAutoStyleObject = sandbox.fake.resolves({});
      await instance.setStyle();
      expect(instance.generateAutoStyleObject.called).to.be.true;
    });
    it('should set automatic styling if "auto" keyword is provided', async () => {
      instance.generateAutoStyleObject = sandbox.fake.resolves({});
      await instance.setStyle('auto');
      expect(instance.generateAutoStyleObject.called).to.be.true;
    });
    it('should set style object to whatever was passed', async () => {
      const mockStyle = { 'backgroundColor': 'black' };
      await instance.setStyle(mockStyle);
      expect(instance.styleObject).to.eq(mockStyle);
    });
    it('should call render method', async () => {
      instance.render = sandbox.spy();
      await instance.setStyle();
      expect(instance.render.called).to.be.true;
    });
    it('should set the styling strategy', async () => {
      await instance.setStyle();
      instance.setStyle = sandbox.spy();
      instance.styleStrategy();
      expect(instance.setStyle.called).to.be.true;
    });
  });
  describe('mergeStyle method', () => {
    it('should set the styling strategy', async () => {
      await instance.mergeStyle();
      instance.mergeStyle = sandbox.spy();
      instance.styleStrategy();
      expect(instance.mergeStyle.called).to.be.true;
    });
    it('should call render method', async () => {
      instance.render = sandbox.spy();
      await instance.mergeStyle();
      expect(instance.render.called).to.be.true;
    });
    it('should generate automatic styling', async () => {
      instance.generateAutoStyleObject = sandbox.fake.resolves({});
      await instance.mergeStyle({});
      expect(instance.generateAutoStyleObject.called).to.be.true;
    });
    it('should merge the automatic style with what was provided', async () => {
      const mockStyle = { backgroundColor: 'black' };
      instance.generateAutoStyleObject = sandbox.fake.resolves({ color: 'red' });
      await instance.mergeStyle(mockStyle);
      expect(instance.styleObject).to.have.keys(['backgroundColor', 'color']);
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
});