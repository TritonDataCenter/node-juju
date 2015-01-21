// starting our UDP server just by requiring our module
require('../index.js');

var udputil = require('./udputil');

// Needs the test directory to be added to the NODE_PATH to find the test charm module.
function run() {
  staggered(100, [
    udputil.send('deploy service=test-charm'),
    udputil.send('add-relation from=test-charm to=other-charm'),
    udputil.send('expose service=test-charm'),
    udputil.send('remove-service service=node-juju'),
    function check(cb) {
      var testCharm = require('test-charm');
      if (testCharm.ops != "darers") {
        console.log("TEST FAILED!", testCharm.ops);
      } else {
        console.log("...ok");
      }
      cb();
    },
    teardown
  ]);
}

function teardown() {
  udputil.close();
}

setTimeout(run, 100);

function staggered(delay, fns) {
  if (fns.length == 0) return;
  var next = fns.shift();
  next(function() {
    setTimeout(function() {
      staggered(delay, fns);
    }, delay);
  })
}
