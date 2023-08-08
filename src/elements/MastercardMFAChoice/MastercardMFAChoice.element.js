/**
 * @param {import('./types').ElementImports} $inject
 */
function mastercardMfaChoice_injector($inject) {
  const { appConfig, HTMLElement } = $inject;
  return class MastercardMFAChoice extends HTMLElement {
    constructor () {
      super();

      this.innerFrame = document.createElement('iframe');
      this.innerFrame.classList.add('mastercard-secure-inputs');
      this.innerFrame.setAttribute('src', 'about:blank');

      this.scheduledRender = false;
    }
    // - Static methods
    /**
     * @static
     * @type {import('./types').ElementExports['observedAttributes']}
     */
    static get observedAttributes() {
      // @ts-ignore
      return ['id', 'form-id'];
    }

    /**
     * 
     * @type {import('./types').ElementExports['attributeChangedCallback']}
     */
    attributeChangedCallback(name) {
      if (name !== 'id' && name !== 'form-id') {
        return;
      }
      this.elemId = this.getAttribute('id');
      this.formId = this.getAttribute('form-id');
      if (!this.elemId || !this.formId || !this.innerFrame) {
        return;
      }
      if (this.isConnected && !this.scheduledRender) {
        this.render();
      }
    }

    /**
     * The reason for the queue microtask is to prevent the connected callback and the attribute change
     * triggering at the same time and firing off http calls that will ultimately get cancelled. This way
     * both can update this value in the same process tick, and at the end of that tick we'll just render once
     * @type {import('./types').ElementExports['render']}
     */
    render() {
      this.scheduledRender = true;
      queueMicrotask(() => {
        this.generateStyleString();
        const src = `${appConfig.sdkBase}/frames/parent/mfa/${this.formId}/elements/${this.elemId}/contents.html?style=${this.encodedStyle}`;
        this.innerFrame.setAttribute('src', src);
      });
    }

    /**
     * @type {import('./types').ElementExports['connectedCallback']}
     */
    connectedCallback() {
      this.appendChild(this.innerFrame);
      if (!this.encodedStyle && !this.scheduledRender) {
        this.render();
      }
    }

    /**
     * @type {import('./types').ElementExports['generateStyleString']}
     */
    generateStyleString() {
      const mockElement = document.createElement('input');
      mockElement.setAttribute('type', 'text');
      this.append(mockElement);
      if (this.classList.length) {
        Array.from(this.classList).forEach(className => {
          mockElement.classList.add(className);
          this.classList.remove(className);
        });
      }

      const computedStyle = window.getComputedStyle(mockElement, null);

      const paddingLeft = parseFloat(computedStyle.paddingRight);
      const paddingRight = parseFloat(computedStyle.paddingRight);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);

      const height = parseFloat(computedStyle.height);
      const width = parseFloat(computedStyle.width);

      Object.assign(this.innerFrame.style, {
        overflow: 'hidden',
        margin: computedStyle.margin,
        // padding: computedStyle.padding,
        height: `${height + paddingTop + paddingBottom}px`,
        width: `${width + paddingRight + paddingLeft}px`,
        borderWidth: computedStyle.borderWidth,
        borderRadius: computedStyle.borderRadius,
        borderColor: computedStyle.borderColor,
        display: computedStyle.display,
      });
      this.style.height = 'auto';

      this.styleObject = {
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        letterSpacing: computedStyle.letterSpacing,
        paddingTop: computedStyle.paddingTop,
        paddingLeft: computedStyle.paddingLeft,
        paddingRight: computedStyle.paddingRight,
        paddingBottom: computedStyle.paddingBottom,
      };

      const styleString = Object.keys(this.styleObject).map(key => {
        // @ts-ignore
        return `${key}=${this.styleObject[key] ?? 'inherit'}`;
      }).join(';');
      this.encodedStyle = window.btoa(styleString);
      this.removeChild(mockElement);
    }
  };
}

export default mastercardMfaChoice_injector;
