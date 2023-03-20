function mastercardSubmit_injector() {
  return class MastercardSubmit extends HTMLElement {
    constructor() {
      super();
      const existing = this.innerHTML;
      this.innerHTML = `<input type='submit' 
        class='mastercard-button'
        value='${this.getAttribute('value')}'>
        ${existing}
        </input>
      `;
    }

    connectedCallback() {
      const $elem = this.querySelector('input');

      if (this.classList.length) {
        Array.from(this.classList).forEach(className => {
          $elem.classList.add(className);
          this.classList.remove(className);
        });
      }

      const parentForm = this.querySelector('input').form;
      // We need to hijack the form submit for this to work
      if (!parentForm) {
        console.error(`Orphaned submit button detected`);
        return;
      }
      parentForm.onsubmit = function(event) {
        event.preventDefault();
        const mastercardSubmit = new Event('mastercard-form-submit');

        parentForm.dispatchEvent(mastercardSubmit);
      }
    }

  }
}

export default mastercardSubmit_injector;
