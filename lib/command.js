var COMMANDS = ['deploy', 'remove-service', 'expose', 'unexpose', 'get', 'set',
                'unset', 'add-relation', 'remove-relation', 'add-unit', 'remove-unit'];

// Simple prototype for a Juju command, encapsulating its name and options.
function JujuCommand(name, options) {
  this.name = name;
  this.options = options;
}

/*
 * Parses a command string as forwarded on our UDP bridge. Expected format is:
 *   [command name] ([option name]=[option value])*
 * Example:
 *   deploy service=local:trusty/vsftpd repository=/usr/share/charms/
 */
JujuCommand.parse = function(str) {
  var parts = str.split(' ');

  // extracting command name
  if (parts.length == 0) {
    console.log("node-juju: unrecognized command string, ignoring: ", str);
    return null;
  }
  if (COMMANDS.indexOf(parts[0]) < 0) {
    console.log("node-juju: unrecognized command name, ignoring: ", parts[0]);
    return null;
  }
  var name = parts[0].trim();

  // extracting command options
  var options = {};
  for (var n = 1; n < parts.length; n++) {
    var opt = parts[n].split('=');
    if (opt.length != 2) {
      console.log("node-juju: unrecognized option, ignoring: ", parts[n]);
      return null;
    }
    var key = opt[0].trim();
    var value = opt[1].trim();
    if (value[0] == "\"" && value[value.length-1] == "\"") {
      value = value.slice(1, -2);
    }
    options[key] = value;
  }

  return new JujuCommand(name, options);
}

/*
 * Sends the command to the provided recipient if it implements it (declares a
 * function with the command name).
 */
JujuCommand.prototype.send = function(recipient) {
  if (recipient != null) {
    var recipientfn = recipient[dashToCamel(this.name)];
    if (recipientfn != null && typeof recipientfn == "function") {
      recipientfn.call(recipient, this.options);
    }
  }
}

// Simple utility function to camelcase instead of dasherize.
function dashToCamel(str) {
  if (str.length == 0) { return ""; }
  var parts    = str.split('-');
  var newParts = [];
  newParts.push(parts[0]);
  for (var n = 1; n < parts.length; n++) {
    var part = parts[n];
    var cameled = part[0].toUpperCase() + part.slice(1);
    newParts.push(cameled);
  }
  return newParts.join('');
}

module.exports = JujuCommand;
