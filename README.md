WebdriverIO Browserstack Service
==========

> A WebdriverIO service that manages local tunnel and job metadata for Browserstack users.

## Installation

Simply run:

```bash
npm install --save-dev wdio-browserstack-service
```

## Configuration

WebdriverIO has Browserstack support out of the box. You should simply set `user` and `key` in your `wdio.conf.js` file. This service plugin provides supports for [Browserstack Tunnel](https://www.browserstack.com/automate/node#setting-local-tunnel). Set `browserstackLocal: true` also to activate this feature.

```js
// wdio.conf.js
export.config = {
  // ...
  services: ['browserstack'],
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  browserstackLocal: true,
};
```

## Options

### user
Your Browserstack username.

Type: `String`

### key
Your Browserstack access key.

Type: `String`

### browserstackLocal
Set this to true to enable routing connections from Browserstack cloud through your computer. You will also need to set `browserstack.local` to true in browser capabilities.

Type: `Boolean`<br>
Default: `false`

### browserstackOpts
Specified optional will be passed down to BrowserstackLocal. See [this list](https://www.browserstack.com/local-testing#modifiers) for details.

Type: `Object`<br>
Default: `{}`

----

# Known Issues

- It's more of how webdriverio desigend the multi-process model. It is extremely hard if not impossible to reliable transfer localIdentifier to child-processes. We recommend to use it without the identifier at this moment, which will create an account-wide local tunnel.

# Credits

- [wdio-sauce-service](https://github.com/webdriverio/wdio-sauce-service)
- [browserstack-local](https://github.com/browserstack/browserstack-local-nodejs)
- ... and all other dependencies

For more information on WebdriverIO see the [homepage](http://webdriver.io).
