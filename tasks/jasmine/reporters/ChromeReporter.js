(function () {
  window.ChromeQueue = [];

  function pushToQueue (msg) {
    window.ChromeQueue.push(msg);
  }

  var ChromeReporter = {
    /**
     * ### jasmineStarted
     *
     * `jasmineStarted` is called after all of the specs have been loaded, but just before execution starts.
     */
    jasmineStarted: function (suiteInfo) {
      /**
       * suiteInfo contains a property that tells how many specs have been defined
       */
      console.log('Jasmine started: ', new Date().toString());
      pushToQueue({
        type: 'JASMINE_STARTED',
        when: new Date().getTime(),
        payload: suiteInfo
      });
    },
    /**
     * ### suiteStarted
     *
     * `suiteStarted` is invoked when a `describe` starts to run
     */
    suiteStarted: function (result) {
      /**
       * the result contains some meta data about the suite itself.
       */
      // console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
      pushToQueue({
        type: 'SUITE_STARTED',
        payload: result
      });
    },
    /**
     * ### specStarted
     *
     * `specStarted` is invoked when an `it` starts to run (including associated `beforeEach` functions)
     */
    specStarted: function (result) {
      /**
       * the result contains some meta data about the spec itself.
       */
      // console.log('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
      pushToQueue({
        type: 'SPEC_STARTED',
        payload: result
      });
    },
    /**
     * ### specDone
     *
     * `specDone` is invoked when an `it` and its associated `beforeEach` and `afterEach` functions have been run.
     *
     * While jasmine doesn't require any specific functions, not defining a `specDone` will make it impossible for a reporter to know when a spec has failed.
     */
    specDone: function (result) {
      /**
       * The result here is the same object as in `specStarted` but with the addition of a status and lists of failed and passed expectations.
       */
      // console.log('Spec: ' + result.description + ' was ' + result.status);
      // pushToQueue('Spec: ' + result.description + ' was ' + result.status);
      pushToQueue({
        type: 'SPEC_FINISHED',
        payload: result
      });

      // for(var i = 0; i < result.failedExpectations.length; i++) {
      //   /**
      //    * Each `failedExpectation` has a message that describes the failure and a stack trace.
      //    */
      //   console.log('Failure: ' + result.failedExpectations[i].message);
      //   console.log(result.failedExpectations[i].stack);
      // }

      // /**
      //  * The `passedExpectations` are provided mostly for aggregate information.
      //  */
      // console.log(result.passedExpectations.length);
    },
    /**
     * ### suiteDone
     *
     * `suiteDone` is invoked when all of the child specs and suites for a given suite have been run
     *
     * While jasmine doesn't require any specific functions, not defining a `suiteDone` will make it impossible for a reporter to know when a suite has failures in an `afterAll`.
     */
    suiteDone: function (result) {
      /**
       * The result here is the same object as in `suiteStarted` but with the addition of a status and a list of failedExpectations.
       */
      // console.log('Suite: ' + result.description + ' was ' + result.status);
      // for(var i = 0; i < result.failedExpectations.length; i++) {
      //   /**
      //    * Any `failedExpectation`s on the suite itself are the result of a failure in an `afterAll`.
      //    * Each `failedExpectation` has a message that describes the failure and a stack trace.
      //    */
      //   console.log('AfterAll ' + result.failedExpectations[i].message);
      //   console.log(result.failedExpectations[i].stack);
      // }
      pushToQueue({
        type: 'SUITE_DONE',
        payload: result
      });
    },
    /**
     * ### jasmineDone
     *
     * When the entire suite has finished execution `jasmineDone` is called
     */
    jasmineDone: function () {
      pushToQueue({
        type: 'FINISHED',
        when: new Date().getTime()
      });
    }
  };

  var env = jasmine.getEnv();

  env.addReporter(ChromeReporter);
})();
