import { expect } from 'chai';
import sinon from 'sinon';
import injector from '../EventStream.element';
import { randomUUID as uuid, randomInt } from 'crypto';

describe('elements/EventStream/EventStream.service', () => {
  const sandbox = sinon.createSandbox();

  let $elem, $inject, instance;
  class MockElement {
    constructor () {
      this.style = {}
    }
  }
  MockElement.prototype.getAttribute = sandbox.fake.returns(true);
  MockElement.prototype.setAttribute = sandbox.spy();
  MockElement.prototype.append = sandbox.fake.returns(true);

  beforeEach(() => {
    $inject = {
      appConfig: {
        sdkBase: 'mock'
      },
      HTMLElement: MockElement,
      logger: {
        warn: sandbox.spy(),
      }
    };

    global.document = {
      createElement: sandbox.spy(function () {
        return new MockElement();
      })
    };
    global.window = {
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
        .to.include('event-stream-id');
    });
  });

  describe('connectedCallback method', () => {
    it('should get the event stream id if one was not already assigned', () => {
      instance.connectedCallback();
      expect(instance.getAttribute.calledWithExactly('event-stream-id')).to.be.true;
    });
    it('should not read attributes if event stream id is already assigned', () => {
      instance.eventStreamId = '12456'
      instance.connectedCallback();
      expect(instance.getAttribute.called).to.be.false;
    });
    it('should create an iframe', () => {
      instance.connectedCallback();
      expect(global.document.createElement.calledWithExactly('iframe')).to.be.true;
      expect(instance.append.called).to.be.true;
    });
    it('should hide itself', () => {
      instance.connectedCallback();
      expect(instance.style.display).to.eq('none');
    });
    it('should bind event sources if the event stream id is set', () => {
      instance.eventStreamId = '12456'
      instance._bindFrameSource = sandbox.spy();
      instance._registerEventListener = sandbox.spy();
      instance.connectedCallback();

      expect(instance._bindFrameSource.called).to.be.true;
      expect(instance._registerEventListener.called).to.be.true;
    });
    it('should not bind event sources if the event stream id is not set', () => {
      instance.eventStreamId = null;
      instance.getAttribute = sandbox.fake.returns(null);

      instance._bindFrameSource = sandbox.spy();
      instance._registerEventListener = sandbox.spy();
      instance.connectedCallback();

      expect(instance._bindFrameSource.called).to.be.false;
      expect(instance._registerEventListener.called).to.be.false;
    });
  });

  describe('attributeChangedCallback method', () => {
    beforeEach(() => {
      instance._bindFrameSource = sandbox.spy();
      instance._registerEventListener = sandbox.spy();
    });
    it('should not do anything if the element is not mounted to the DOM', () => {
      instance.isConnected = false;
      instance.attributeChangedCallback('event-stream-id', null, '12345');
      expect(instance._bindFrameSource.called).to.be.false;
      expect(instance._registerEventListener.called).to.be.false;
    });
    it('should not do anything if the changed attribute is not event-stream-id', () => {
      instance.isConnected = true;
      instance.attributeChangedCallback('not-event-stream-id', null, '12345');
      expect(instance._bindFrameSource.called).to.be.false;
      expect(instance._registerEventListener.called).to.be.false;
    });
    it('should rebind the event source if the event stream id changes', () => {
      instance.isConnected = true;
      instance.attributeChangedCallback('event-stream-id', null, '12345');
      expect(instance._bindFrameSource.called).to.be.true;
      expect(instance._registerEventListener.called).to.be.true;
    });
  });
  describe('_bindFrameSource method', () => {
    beforeEach(() => {
      instance.connectedCallback();
    });
    it('should update the iframe src', () => {
      instance._bindFrameSource();
      expect(instance.iframe.setAttribute.calledWith('src')).to.be.true;
    });
  });
  describe('_registerEventListener method', () => {
    beforeEach(() => {
      instance.connectedCallback();
    });
    it('should register an event listener on the window object', () => {
      instance._registerEventListener();
      expect(global.window.addEventListener.calledWith('message')).to.be.true;
    });
    describe('window message callback', () => {
      let cb;
      beforeEach(() => {
        instance._registerEventListener();
        instance.events.dispatchEvent = sandbox.spy();
        cb = global.window.addEventListener.getCall(0).args[1];
      });
      it('should skip events not intended for us', () => {
        const mockEvent = {
          origin: 'not-mock'
        };
        cb(mockEvent);
        expect(instance.events.dispatchEvent.called).to.be.false;
      });
      it('should dispatch events we receive', () => {
        const mockEvent = {
          origin: 'mock', // From our $inject object up top
          data: {
            id: '12345',
            eventType: 'mock-event',
            isPublic: true
          }
        };
        cb(mockEvent);
        expect(instance.events.dispatchEvent.called).to.be.true;
      });
    });
    describe('_isValidEventStreamId method', () => {
      it('should return true for valid UUIDs', () => {
        for (let i = 0; i < 100; i++) {
          expect(instance._isValidEventStreamId(uuid())).to.be.true;
        }
      });
      it('should return false on invalid UUIDs', () => {
        for (let i = 0; i < 100; i++) {
          expect(instance._isValidEventStreamId(`${randomInt(10000)}`)).to.be.false;
        }
      });
    });
  });
});