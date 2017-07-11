const request = require('request-promise');

class BrowserstackService {
  before() {
    this.sessionId = global.browser.sessionId;
    this.auth = global.browser.requestHandler.auth || {};
    this.failures = 0;

    return this._printSessionURL();
  }

  afterSuite (suite) {
    if (suite.hasOwnProperty('err')) {
      this.failures++;
    }
  }

  afterTest (test) {
    if (!test.passed) {
      this.failures++;
    }
  }

  after() {
    return this._update(this.sessionId, this._getBody());
  }

  onReload(oldSessionId, newSessionId) {
    this.sessionId = newSessionId;
    return this._update(oldSessionId, this._getBody())
      .then(() => this._printSessionURL());
  }

  _update(sessionId, body) {
    return request({
      method: 'PUT',
      uri: `https://www.browserstack.com/automate/sessions/${sessionId}.json`,
      json: true,
      auth: this.auth,
      body
    });
  }

  _getBody() {
    return {
      status: (this.failures === 0) ? 'completed' : 'error'
    };
  }

  _printSessionURL() {
    const capabilities = global.browser.desiredCapabilities;
    return request({
      uri: `https://www.browserstack.com/automate/sessions/${this.sessionId}.json`,
      json: true,
      auth: this.auth
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // These keys describe the browser the test was run on
        const browserDesc = ['device', 'os', 'osVersion', 'os_version', 'browserName', 'browser', 'browserVersion', 'browser_version'];
        const browserString = browserDesc.map((k) => capabilities[k]).filter((v) => !!v).join(' ');
        console.log(`[Browserstack] ${browserString} session: ${body.automation_session.browser_url}`);
      }
    });
  }
}

module.exports = BrowserstackService;
