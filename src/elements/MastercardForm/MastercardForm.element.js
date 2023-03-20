function mastercardForm_injector($inject) {
  const { http } = $inject;

  return class MastercardForm extends HTMLElement {
    constructor() {
      super();
      const existing = this.innerHTML;
      this.innerHTML = `<form>${existing}</form>`;
    }

    // - Lifecycle events
    connectedCallback() {
      const $elem = this.querySelector('form');
      if (this.classList.length) {
        Array.from(this.classList).forEach(className => {
          $elem.classList.add(className);
          this.classList.remove(className);
        });
      }
      $elem.addEventListener('mastercard-form-submit', event => {
        this.onSubmit.call(this, event);
      });
    }

    // - Custom methods
    onSubmit(event) {
      event.preventDefault();
      const formId = this.getAttribute('form-key');
      const formInputs = Array.from(this.querySelectorAll('mastercard-input'));
      if (!formInputs || !formInputs.length) {
        console.error(`No form inputs to submit`);
        return;
      }
      formInputs.forEach(input => {
        input.submit.call(input, formId);
      });
      // Wait and then grab the login status
      setTimeout(async () => {
        const formResponse = await http.post(`sessions/forms/${formId}`)
        const onTokenize = new Event('tokenized');
        onTokenize.value = formResponse.token;
        this.dispatchEvent(onTokenize);
      }, 500);
      
    }
  }
}

export default mastercardForm_injector;
