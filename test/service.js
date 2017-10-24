const sinon = require('sinon');
const request = require('request-promise');
const Browserstack = require('../lib/browserstack-service.js');

let getStub;
let putStub;

describe('BrowserstackService', function() {
  const browserstack = new Browserstack();
  before(function() {
    global.browser = {
      desiredCapabilities: {
        device: '',
        os: 'OS X',
        os_version: 'Sierra',
        browserName: 'chrome'
      }
    };

    browserstack.auth = {};
    browserstack.failures = 0;
    browserstack.sessionId = 1;

    putStub = sinon.stub(request, 'put');
    getStub = sinon.stub(request, 'get');

    putStub.resolves(Promise.resolve('{}'));
    getStub.resolves(Promise.resolve('{}'));
  });

  after(function() {
    request.put.restore();
    request.get.restore();
  });

  describe('#onReload()', function() {
    before(function() {
      sinon.spy(browserstack, '_update');
    });

    after(function() {
      browserstack._update.restore();
    });

    it('should update and get session', function() {
      browserstack.onReload(1, 2);
      sinon.assert.called(putStub);
      sinon.assert.called(getStub);
    });

    it('should reset failures', function() {
      browserstack.failures = 1;
      browserstack.onReload(1, 2);
      sinon.assert.called(browserstack._update);
      sinon.match(browserstack.failures, 0);
    });

    it('should call functions in the expected order', function() {
      sinon.spy(browserstack, '_printSessionURL');

      browserstack.onReload(1, 2);
      sinon.assert.callOrder(
        browserstack._update,
        browserstack._printSessionURL
      );

      browserstack._printSessionURL.restore();
    });
  });

  describe('#_printSessionURL', function() {
    before(function() {
      sinon.spy(console, 'log');
      getStub.callsFake(function(args, func) {
        return Promise.resolve(
          func(
            null,
            { statusCode: 200 },
            {
              automation_session: {
                name: 'Smoke Test',
                duration: 65,
                os: 'OS X',
                os_version: 'Sierra',
                browser_version: '61.0',
                browser: 'chrome',
                device: null,
                status: 'failed',
                hashed_id: '1',
                reason: 'CLIENT_STOPPED_SESSION',
                build_name: 'WebdriverIO Test',
                project_name: 'webdriverio',
                logs:
                  'https://www.browserstack.com/automate/builds/1/sessions/2/logs',
                browser_url:
                  'https://www.browserstack.com/automate/builds/1/sessions/2',
                public_url:
                  'https://www.browserstack.com/automate/builds/1/sessions/2',
                video_url:
                  'https://www.browserstack.com/s3-upload/bs-video-logs-use/s3/2/video-2.mp4',
                browser_console_logs_url:
                  'https://www.browserstack.com/s3-upload/bs-selenium-logs-use/s3/2/2-console-logs.txt',
                har_logs_url:
                  'https://www.browserstack.com/s3-upload/bs-video-logs-use/s3/2/2-har-logs.txt'
              }
            }
          )
        );
      });
    });

    after(function() {
      console.log.restore();
    });

    it('should get and log session details', function() {
      browserstack._printSessionURL();
      sinon.assert.calledOnce(console.log);
      sinon.assert.calledWith(
        console.log,
        '[Browserstack] OS X Sierra chrome session: https://www.browserstack.com/automate/builds/1/sessions/2'
      );
    });
  });
});
