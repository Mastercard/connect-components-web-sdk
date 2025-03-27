import MastercardForm from './elements/MastercardForm';
import MastercardInput from './elements/MastercardInput';
import MastercardMFAChoice from './elements/MastercardMFAChoice';
import MastercardEventStream from './elements/EventStream';
import appConfig from './config/app';

// @ts-ignore
customElements.define('mastercard-form', MastercardForm);
// @ts-ignore
customElements.define('mastercard-input', MastercardInput);
// @ts-ignore
customElements.define('mastercard-mfa-choice', MastercardMFAChoice);
// @ts-ignore
customElements.define('mastercard-event-stream', MastercardEventStream);

export { appConfig };