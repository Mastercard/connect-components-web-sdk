function mastercardMfaChoice_injector() {
    return class MastercardMFAChoice extends HTMLElement {

        constructor() {
            super();
            const existing = this.innerHTML;
            //dont know what to render
            this.innerHTML = `
                <div class='mastercard-mfa-choice'>
                    <input type='radio' id='${this.id()}'/>
                </div>
            `
        }

        connectedCallback() {
            console.log("nothing to do")
        }

        get id() {
            return this.getAttribute("id");
        }

    }

}

export default mastercardMfaChoice_injector;