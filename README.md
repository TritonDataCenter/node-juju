Adapter to Juju in nodejs-land. Relays Juju events to a node process (via UDP).
Requires the nodejs Charm.

Usage
-----
This module is used to implement Juju Charms in nodejs land. It provides a bridge
within a nodejs process that relays Juju events to a classic Javascript object
implementing the functionalities of the nodejs charm. The node-juju module is meant
to be used in combination with the nodejs Charm which implements the other part of the
bridge.

To implement a charm simply create a Javascript object exposing functions matching
Juju commands. Arguments are provided in an option object.

Example:

    var myCharm = {
      deploy: function(options) {
        // deploy ourselves
      },
      expose: function(options) {
        // publicly 
      },
      addRelation: function(options) {
        //
      },
      removeService: function(options) {
        //
      }
    }
    module.exports = myCharm;

Only the commands used by your charm need to be implemented.

Provided you're using the Juju node Charm, Juju commands will be relayed and the
functions implemented by your charm called appropriately.


Install
-------
    npm install node-juju

Run tests using:

    npm test

Details
-------
This module expects messages over UDP that closely match juju commands. The node Charm, 
when installed, will emit the appropriate UDP messages relaying the executed command.

UDP messages are expected to be in the following format:

   [command name] ([option name]=[option value])*

For example:

    deploy service=local:trusty/vsftpd repository=/usr/share/charms/
