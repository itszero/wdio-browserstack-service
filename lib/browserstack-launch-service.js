const Browserstack = require('browserstack-local');

class BrowserstackLauncherService {
  onPrepare(config) {
    if (!config.browserstackLocal) { return; }
    const opts = {
      key: config.key,
      forcelocal: true,
      onlyAutomate: true,
      ...config.browserstackOpts
    };
    this.browserstackLocal = new Browserstack.Local();

    return new Promise((resolve) => {
      this.browserstackLocal.start(opts, () => resolve());
    });
  }

  onComplete() {
    if (!this.browserstackLocal) { return; }
    return new Promise((resolve) => {
      this.browserstackLocal.stop(() => resolve());
    });
  }
}

module.exports = BrowserstackLauncherService;