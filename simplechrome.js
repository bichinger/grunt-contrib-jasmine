var Chrome = require('simple-headless-chrome');
var grunt = require('grunt');

var browser = new Chrome({
  headless: true,
});

function consume (tab) {
  return tab.evaluate(function () {
    return ChromeQueue.splice(0, ChromeQueue.length);
  });
}

var duration;
var finishedResult = {
  failed: 0
};
var fails = [];
// All of this would be much more straightforward with async/await
browser.init()
  .then(browser => browser.newTab({ privateTab: false }))
  .then(tab => {
    return tab.goTo("http://localhost:8088/_SpecRunner-affected.html")
      // Return a promise that resolves when we get the FINISHED event from our ChromeReporter
      .then(() => new Promise(resolve => {
        // Periodically evaluate
        var interval = setInterval(function () {
          consume(tab)
            .then(result => {
              var events = result.result.value;
              events.forEach(e => {
                if (e.type === 'JASMINE_STARTED') {
                  duration = e.when;
                }
                if (e.type === 'FINISHED') {
                  duration = e.when - duration;
                }
                if (e.type === 'SPEC_FINISHED') {
                  if (e.payload.status === 'passed') {
                    process.stdout.write('.') 
                  } else if (e.payload.status === 'pending') {
                    process.stdout.write('*');
                  } else if (e.payload.status === 'failed') {
                    process.stdout.write('x');
                  }
                  if (e.payload.failedExpectations.length > 0) {
                    finishedResult.failed++;
                    fails.concat(e.payload.failedExpectations);
                  }
                }
                // process.stdout.write('.')
              })
              if (events.length > 0 && events[events.length - 1].type === 'FINISHED') {
                clearInterval(interval);
                resolve();
              }
            })
        }, 100);
      }))
      .then(() => { grunt.log.writeln('\nFinished testing (' + (duration / 1000) + ' seconds)')})
      .then(() => browser.close())
  }
  )