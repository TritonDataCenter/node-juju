var dgram  = require('dgram');

var JujuCommand = require('./command');
var charms      = require('./charms');

// For security reasons we only bind to localhost, the local juju instance will
// contact us directly
var HOST = '127.0.0.1';
var PORT = 23450;

var nodeJujuCharms = [];

/*
 * Starts listening on Juju events as relayed by the node-juju charm.
 */
function start() {
  var server = dgram.createSocket('udp4');
  
  server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
  });
  
  server.on('message', function (message, remote) {
    var cmd = JujuCommand.parse(message.toString());
    if (cmd != null) {
      for (var n = 0; n < nodeJujuCharms.length; n++) {
        cmd.send(nodeJujuCharms[n].charm);
      }
    }
  });

  server.on('error', function(err) {
    console.log("node-juju: UDP server error:\n" + err.stack);
  });
  
  server.bind(PORT, HOST);

  // A little bit of self-referential calling, register the node-charm that handles requiring
  // newly deployed modules so they can get loaded and registered.
  register("__internalDeploy", charms.deployRequireCharm(register));
  register("__internalUndeploy", charms.undeployCharm(unregister, server));
}

function register(name, nodeJujuCharm) {
  nodeJujuCharms.push({name: name, charm: nodeJujuCharm});
}

function unregister(name) {
  nodeJujuCharms = nodeJujuCharms.filter(function(obj) {
    return obj.name != name;
  });
}

module.exports = start;
