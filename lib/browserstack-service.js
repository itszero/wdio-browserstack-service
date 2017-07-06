const request = require('request-promise');

class BrowserstackService {
  before() {
    this.sessionId = global.browser.sessionId;
    this.auth = global.browser.requestHandler.auth || {};
    this.failures = 0;
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
    return this._update(this.sessionId, this._getBody());
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
}

module.exports = BrowserstackService;
