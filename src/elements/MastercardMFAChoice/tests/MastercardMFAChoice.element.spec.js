import { expect } from 'chai';
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
    // The fact that we can do this proves javascript is weird
    MockElement.prototype.classList = [];
    MockElement.prototype.classList.add = sandbox.spy();
    MockElement.prototype.classList.remove = sandbox.spy();

    $inject = {
      appConfig: {
        sdkBase: 'mock'
      },
      HTMLElement: MockElement
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
    it('should not call render if there is an encoded style', () => {
      instance.encodedStyle = 'some style';
      instance.scheduledRender = false;
      instance.render = sandbox.spy();
      instance.connectedCallback();
      expect(instance.render.called).to.be.false;
    });
    it('should not call render if there is a scheduled render', () => {
      instance.encodedStyle = undefined;
      instance.scheduledRender = true;
      instance.render = sandbox.spy();
      instance.connectedCallback();
      expect(instance.render.called).to.be.false;
    })
    it('should call render otherwise', () => {
      instance.encodedStyle = undefined;
      instance.scheduledRender = false;
      instance.render = sandbox.spy();
      instance.connectedCallback();
      expect(instance.render.called).to.be.true;
    });
  });
  describe('render method', () => {
    it('should generate a style string and set the iframe src', (done) => {
      instance.generateStyleString = sandbox.spy();
      instance.render();
      // Settimeout will schedule this after the queueMicrotask
      setTimeout(() => {
        expect(instance.generateStyleString.called).to.true;
        expect(instance.scheduledRender).to.be.true;
        expect(instance.innerFrame.setAttribute.called).to.be.true;
        done();
      }, 100);
    });
  });
  describe('generateStyleString method', () => {
    it('should create a mock element', () => {
      instance.generateStyleString();
      expect(global.document.createElement.calledWith('input')).to.be.true;
    });
    it('should scrape styles from the mock element and add them to this element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      global.document.createElement = sandbox.fake.returns(mockElement);
      instance.generateStyleString();
      expect(instance.classList).to.include('class1', 'class2');
    });
    it('should remove classes from itself when applying them to the mock element', () => {
      const mockElement = new MockElement();
      mockElement.classList.push('class1', 'class2');
      global.document.createElement = sandbox.fake.returns(mockElement);

      instance.generateStyleString();
      expect(instance.classList.remove.callCount).to.eq(2);
    });
    it('should encode the style', () => {
      instance.generateStyleString();
      expect(global.window.btoa.called).to.be.true;
      expect(instance.encodedStyle).to.eq('base64 data'); // from our btoa mock
    });
    it('should remove the mock element when done', () => {
      instance.generateStyleString();
      expect(instance.removeChild.called).to.be.true;
    });
  });
  describe('attributeChangedCallback method', () => {
    beforeEach(() => {
      instance.render = sandbox.spy();
    })
    it('should ignore changes that are not id or form-id', () => {
      instance.attributeChangedCallback('something');
      expect(instance.elemId).to.be.undefined;
    });
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
    it('should render otherwise', () => {
      instance.getAttribute = sandbox.fake.returns('mock-attr');
      instance.innerFrame = {};
      instance.scheduledRender = false;
      instance.isConnected = true;
      instance.attributeChangedCallback('id');
      expect(instance.render.called).to.be.true;
    });
  });
});