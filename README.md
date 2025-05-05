# CC SDK - Web

## Overview

The Connect Components SDK provides a collection of custom Web Components that can be used to build login forms for legacy institutions, initiate OAuth authentication flow for institutions, and render Multi-Factor Authorization challenges encountered during legacy institution login.

## Installing

```bash
npm npm i mastercard-cc-sdk
```

## Elements

All elements are custom Web Componentsopens in a new tab and provide a framework-agnostic way to encapsulate logic needed for each element. These elements enable developers to have complete control over the customer experience.

 **Mastercard Form**
```bash
<mastercard-form type='institution-login' id="" ></mastercard-form>
```
The custom form element is responsible for brokering postMessage connections to the ```<mastercard-input>``` and ```<mastercard-mfa-input>``` elements. For institution logins, both legacy and oauth, the attribute ```type='institution-login'``` will be set.

**Mastercard Input**
```bash
<mastercard-input id=""></mastercard-input>
```
These elements provide the core functionality for ***legacy*** institution login forms. There will need to be one ```<mastercard-input>``` for each of the login form inputs that is returned by the Connect Components API.

This is typically just ```username``` and ```password```, but there are some login forms that have a third or even forth required input. Each ```<mastercard-input>``` element should have a single ```id``` attribute so the Connect Components SDK can render the correct login form data.

**Mastercard MFA Input**
```bash
<mastercard-mfa-input id=""></mastercard-mfa-input>
```
This is the element type that is used to capture a response from a customer. It can be an image or text box and depends on the MFA Challenge response. All that is needed from the calling application is an ```id``` attribute on the ```mastercard-mfa-input``` so the Connect Components SDK can render the correct MFA challenge data.

**Mastercard Event Stream**
```bash
<mastercard-event-stream></mastercard-event-stream>

```
In a legacy login, this element is created automatically by the SDK when a <mastercard-form> (Mastercard Form) element is added to the page. In some of the examples below, you will notice the <mastercard-form> has the event-stream-id. This attribute allows the SDK to associate the correct events with the intended <mastercard-form>.

During an OAuth login, this element will need to be added on the page the customers will be redirected to after the loggedIn event is emitted. This will allow the application to receive the success and error events emitted from the SDK.

**Usage**

From this point, the implementation steps depend on whether you are using login forms or Oauth URL.

* Login Form Usage
* Oauth URL Usage

For futher information on implementation please visit our [Mastercard Documentation](https://developer.mastercard.com/open-banking-us/documentation/connect/components/integration/ccwebsdk/) for developers. 

