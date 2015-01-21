// This file contains a few built-in charms that have special access to internal
// structures making up the node-juju module. Mostly needed for deploy / undeploy
// commands that require special actions.

/*
 * The deploy command is a little special given that we have to call require to
 * load the node charm and pass our node charm registration function for it to start
 * getting juju events.
 */
function deployRequireCharm(register) {
  return {
    deploy: function(options) {
      var serviceName = options['service'];
      if (serviceName == null || serviceName.length == 0) {
        console.log("node-juju: deploy command missing service option, ignoring.");
        return;
      }
      // if we're provided a full path, we only care about the last part which has
      // the name of the service we intend to require, the repository is handled
      // by npm
      var slash = serviceName.indexOf('/');
      if (slash >= 0) {
        serviceName = serviceName.substring(slash+1);
      }
      try {
      	var service = require(serviceName);
        register(serviceName, service);
      } catch(err) {
        console.log("node-juju: error requiring node-juju charm module '" +
                        serviceName + "':\n" + err.stack);
      }
    }
  }
}

/*
 * Undeploys a node-juju charm by unregistering it from our list.
 */
function undeployCharm(unregister, server) {
  return {
    removeService: function(options) {
      var serviceName = options['service'];
      if (serviceName == null || serviceName.length == 0) {
        console.log("node-juju: deploy command missing service option, ignoring.");
        return;
      }
      var slash = serviceName.indexOf('/');
      if (slash >= 0) {
        serviceName = serviceName.substring(slash+1);
      }
      if (serviceName == 'node-juju') {
        // special case of unregistering ourselves, we basically have to commit sepuku
        // by closing our socket and letting ourselves go
        server.close();
      } else {
        unregister(serviceName);
      }
    }
  }
}

module.exports.deployRequireCharm = deployRequireCharm;
module.exports.undeployCharm      = undeployCharm;
