# Connect Components Web SDK

## Overview

The Connect Components SDK provides a collection of custom Web Components that can be used to build login forms for legacy institutions, initiate OAuth authentication flow for institutions, and render Multi-Factor Authorization challenges encountered during legacy institution login.

## Installing

```bash
npm i @mastercard/connect-components-web-sdk
```

## Elements

The Connect Components Web SDK provides several custom [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for use in building login flows. Below is a brief overview of the elements, their attributes, and events.

### Mastercard Form
The Mastercard Form element is used as the parent element for Mastercard Input and Mastercard MFA Choice elements. When a Mastercard Form element is added to the page, a Mastercard Event Stream element will automatically be added as well and will share the `event-stream-id` of the Mastercard Form element.

``` html
<mastercard-form
  form-id: string
  event-stream-id: string
></mastercard-form>
```

#### Properties

| HTML Property Name | Description | Class Property Name |
| -------------- | ------------- | ------------------------ |
| form-id | The 'id' property from the GetLoginForm response | formId |
| event-stream-id | The 'eventStreamId' property from the GetLoginForm response | eventStreamId |
| (none) | Event emitter | events |


#### Events
The `<mastercard-form>` element exposes an event listener on its `.events` property, i.e. `form.events.addEventListener('success', callback)`.

| Event Type | Description | Applicable Flow |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| success | Called when account linking has finished | Legacy / OAuth |
| error | Called on unsuccessful login attempt. Contains a code which may be used to determine error cause | Legacy / OAuth |
| mfaChallenge | Called when a login attempt triggers an multi-factor challenge. MFA challenges may trigger additional `mfaChallenge` events | Legacy |
| formStateChange | Called when all form elements have finished rendering. Can be used to show and hide loading spinners | Legacy |
| blur | Called when any form element has lost focus. The event will contain the `elementId` of the blurred element, i.e. `{"data": {"elementId": "c6221293-9ae2-4ba4-a0ec-9f1670a7798a"}}` | Legacy |
| focus | Called when any form element has gained focus. The event will contain the `elementId` of the focused element, i.e. `{"data": {"elementId": "c6221293-9ae2-4ba4-a0ec-9f1670a7798a"}}`  | Legacy |

### Mastercard Input
``` html
<mastercard-input
  id: string
  form-id: string
  event-stream-id?: string
  component-styles?: string
></mastercard-input>
```
#### Properties

| HTML Property Name | Description | Class Property Name |
| -------------- | ------------- | ------------------------ |
| id | The element[].id property from the GetLoginForm response | id |
| form-id | The 'id' property from the GetLoginForm response | formId |
| event-stream-id (optional) | The 'eventStreamId' property from the GetLoginForm response. Will be set automatically if left blank | eventStreamId |
| component-styles (optional) | Stringified JSON representing the styles to apply, i.e. JSON.stringify({input: {color: red}}) | componentStyles |

#### Events
The input elements do not currently emit their own events. Event handling should be performed on the parent Mastercard Form element.


### Mastercard Event Stream
``` html
<mastercard-event-stream
  event-stream-id: string
  form-id: string
></mastercard-event-stream>
```
#### Properties
| HTML Property Name | Description | Class Property Name |
| -------------- | ------------- | ------------------------ |
| event-stream-id | The eventStreamId property from the GetLoginForm or GetOAuthURL response | eventStreamId |
| form-id | The 'id' property from the GetLoginForm or GetOAuthURL response | formId |
| (none) | Event emitter | events |

#### Events
The event stream shares the same events as the `<mastercard-form>` element. Events are available via its `events` property, i.e. `eventStream.events.addEventListener('success', callback)`.

### Mastercard MFA Choice
``` html
<mastercard-mfa-choice
  id: string
  form-id: string
  event-stream-id?: string
  component-styles?: string
></mastercard-event-stream>
```
#### Properties
| HTML Property Name | Description | Class Property Name |
| -------------- | ------------- | ------------------------ |
| id | The choiceIds[] value from the `mfaChallenge` event body | id |
| form-id | The 'id' property from the GetLoginForm response | formId |
| event-stream-id (optional) | The 'eventStreamId' property from the GetLoginForm response. Will be set automatically if left blank | eventStreamId |
| component-styles (optional) | Stringified JSON representing the styles to apply, i.e. JSON.stringify({input: {color: red}}) | componentStyles |

#### Events
The input elements do not currently emit their own events. Event handling should be performed on the parent Mastercard Form element.

## Additional Information

For information on how to use [Connect Components](https://developer.mastercard.com/) or implement the [Connect Components Web SDK](https://developer.mastercard.com/open-banking-us/documentation/connect/components/integration/ccwebsdk/) please visit the Mastercard Developer Zone.

