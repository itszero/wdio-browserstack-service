const request = require('request-promise');

class BrowserstackService {
  before() {
    this.sessionId = global.browser.sessionId;
    this.auth = global.browser.requestHandler.auth || {};
  }

  after(failures) {
    this._update(this.sessionId, this._getBody(failures === 0));
  }

  _update(sessionId, body) {
    request({
      method: 'PUT',
      uri: `https://www.browserstack.com/automate/sessions/${this.sessionId}.json`,
      json: true,
      auth: this.auth,
      body
    });
  }

  _getBody(success) {
    return {
      status: success ? 'completed' : 'error'
    };
  }
}

module.exports = BrowserstackService;
