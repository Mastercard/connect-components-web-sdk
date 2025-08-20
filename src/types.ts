// This matches up to client/src/classes/BrowserChannel/message-types.constants.js
export enum EventTypes {
  LOGGED_IN = 'loggedIn',
  ERROR = 'error',
  SUCCESS = 'success',
  MFA_CHALLENGE = 'mfaChallenge',
  REGISTER_ELEMENT = 'registerElement',
  RADIO_CLICK = 'radioClick',
  SUBMIT_REQUEST = 'submitRequest',
  SUBMIT_LOGIN_RESPONSE = 'submitLoginResponse',
  SUBMIT_DONE = 'submitDone',
  SUBMIT_MFA_RESPONSE = 'submitMFAResponse',
  FORM_UPDATE = 'formUpdate',
  UNKNOWN = ''
}