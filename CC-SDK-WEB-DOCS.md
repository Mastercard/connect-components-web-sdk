# Connect Components SDK: Web Browsers  
## Table of Contents
- [Connect Components SDK: Web Browsers](#connect-components-sdk-web-browsers)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Usage](#usage)
 


## Overview
This project provides a means for partners to integrate with Connect Components via a web browser. The SDK provides a collection of custom Web Components that can be used to build login forms for legacy institutions, open pop-up windows for oauth institutions, and render Multi-Factor Authorization challenges.

## Installation
  Prerequisites:
  <ul>
    <li><details>
    <summary markdown="span">Install node.js</summary>
    If you haven't already, start by installing node.js using your favorite <a href='https://nodejs.org/en/download/package-manager'>package manager</a> or  use the node.js <a href='https://nodejs.org/en/download'>installer</a> for your operating system.
  </details></li>
      <li><details>
    <summary markdown="span">Initialize your npm project</summary>
    Once you have node.js installed, create a new folder for your project. Open a terminal window and initialize your project by running: 
    <code>npm init</code>
  </details></li>
  <li><details>
    <summary markdown="span">Create a basic web server</summary>
    Now install <a href='https://expressjs.com'>express.js</a> by running:
    <code>npm i express</code>
    You know have all the ingredients for a basic node.js/express application server:
    <pre><code>const express = require('express');
    const app = express();
    app.listen('3000', async err => {
      if (err) {
        console.error(`Server error: ${err}`)
      }
      console.log('Demo app ready.')
    });
    module.exports = app;</code></pre>
  </details></li>
  <li><a href=https://docs.finicity.com/#generate-your-credentials>Finicity Partner ID<a></li>
  <li><a href='https://docs.finicity.com/#generate-your-credentials'>Finicity Partner Secret</a></li>
  <li><a href='https://docs.finicity.com/#generate-your-credentials'>Finicity Application Key</a></li>
  <li><a href='https://docs.finicity.com/#create-an-access-token'>Finicity Application Token</a></li>
  <li><a href='https://docs.finicity.com/#welcome-your-first-customer'>Finicity Customer ID</a></li>
  <li><a href='https://docs.finicity.com/#fetch-some-data'>Institution ID</a></li>
  </ul> 

## Usage






<!-- ## Configuration

## Filing Issues
## Frequently Asked Questions
## Releases
## Security Policy 
## Semantic Versioning Policy
## Stylistic 
## License
## Team -->