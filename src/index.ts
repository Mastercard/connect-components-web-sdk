import MastercardForm from './elements/MastercardForm';
import MastercardInput from './elements/MastercardInput';
import MastercardMFAChoice from './elements/MastercardMFAChoice';
import MastercardEventStream from './elements/EventStream';
import appConfig from './config/app';

try {
  // @ts-ignore
  customElements.define('mastercard-form', MastercardForm);
  // @ts-ignore
  customElements.define('mastercard-input', MastercardInput);
  // @ts-ignore
  customElements.define('mastercard-mfa-choice', MastercardMFAChoice);
  // @ts-ignore
  customElements.define('mastercard-event-stream', MastercardEventStream);
} catch (err) {
  console.warn(err);
}

export {appConfig, MastercardEventStream, MastercardForm, MastercardInput, MastercardMFAChoice };