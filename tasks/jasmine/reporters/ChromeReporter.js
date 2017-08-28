/* global window:true, jasmine:true */

(function () {
  window.ChromeQueue = [];

  function pushToQueue (msg) {
    window.ChromeQueue.push(msg);
  }

  var ChromeReporter = {
    lastSpecStartTime: null,
    jasmineStarted: function (suiteInfo) {
      console.log('Jasmine started: ', new Date().toString());
      pushToQueue({
        type: 'jasmine.jasmineStarted',
        when: new Date().getTime(),
        payload: suiteInfo
      });
    },
    suiteStarted: function (result) {
      pushToQueue({
        type: 'jasmine.suiteStarted',
        payload: result
      });
    },
    specStarted: function (result) {
      this.lastSpecStartTime = new Date();
      pushToQueue({
        type: 'jasmine.specStarted',
        payload: result
      });
    },
    specDone: function (result) {
      result.duration = new Date() - this.lastSpecStartTime;
      pushToQueue({
        type: 'jasmine.specDone',
        payload: result
      });
    },
    suiteDone: function (result) {
      pushToQueue({
        type: 'jasmine.suiteDone',
        payload: result
      });
    },
    jasmineDone: function () {
      pushToQueue({
        type: 'jasmine.jasmineDone'
      });
    }
  };

  var env = jasmine.getEnv();

  env.addReporter(ChromeReporter);
})();
