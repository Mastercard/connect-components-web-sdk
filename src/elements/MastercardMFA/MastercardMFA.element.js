function mastercardMfa_injector() {
    return class MastercardMFA extends HTMLElement {

        constructor() {
            super();
            const existing = this.innerHTML;
            //this should be a list of choices
            const mfaChoices = this.getAttribute("mfaChoices");
            //this should be an array of ids
            if(mfaChoices && Array.isArray(mfaChoices)) {
                let mfaChoiceElementList = mfaChoices.map((mfaChoiceId) => {
                    let tempElement = document.createElement("mastercard-mfa-choice");
                    tempElement.setAttribute("id", mfaChoiceId);
                });
                existing.append(...mfaChoiceElementList);
            }
        }

        connectedCallback() {
            const $elem = this.querySelector('form');
            //form submit handler
            $elem.addEventListener('mastercard-form-submit', event => {
                this.onSubmit.call(this, event);
            });
        }

        onSubmit(event) {
            event.preventDefault();
        }

        get id() {
            const parentForm = this.querySelector('input').form;
            return parentForm.getAttribute("id");
        }

    }
}

export default mastercardMfa_injector;