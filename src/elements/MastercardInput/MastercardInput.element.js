function mastercardInput_injector($inject) {
  const { appConfig } = $inject;
  return class MastercardInput extends HTMLElement {
    constructor() {
      super();
      const existing = this.innerHTML;
      this.innerHTML = `
      <div class='secure-input'>
        ${existing}
        <iframe 
          class='mastercard-secure-inputs'
          sandbox='allow-scripts allow-same-origin'
          src='about:blank'></iframe>
      </div>`;
    }

    connectedCallback() {
      const mockElement = document.createElement('input');
      mockElement.setAttribute('type','text');
      this.appendChild(mockElement);
      if (this.classList.length) {
        Array.from(this.classList).forEach(className => {
          mockElement.classList.add(className);
          this.classList.remove(className);
        });
      }
      this.styles = window.getComputedStyle(mockElement, null);
      const injectStyle = {
        color: this.styles.color,
      };
      for (let key of this.styles) {
        if (key.indexOf('font') === 0 && key !== 'font') {
          injectStyle[key] = this.styles[key];
        }
      }
      const styleString = window.btoa(JSON.stringify(injectStyle));
      
      const frame = this.querySelector('iframe');
      for (let style of this.styles) {
        frame.style[style] = this.styles[style];
      }
      const instanceId = this.getAttribute('id');
      const parentForm = this.querySelector('input').form;
      const formId = parentForm.getAttribute('id');
      const src = `${appConfig.sdkBase}/login-forms/${formId}/elements/${instanceId}/contents.html?style=${styleString}`;

      frame.setAttribute('src', src);
      this.removeChild(mockElement);

    }

    submit(parentFormId) {
      const $elem = this.querySelector('iframe');
      const data = JSON.stringify({ formId: parentFormId, eventType: 'submit' });
      $elem.contentWindow.postMessage(data, '*');
    }
  }
}

export default mastercardInput_injector;
