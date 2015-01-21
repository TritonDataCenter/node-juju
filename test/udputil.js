var PORT = 23450;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = new Buffer('My KungFu is Good!');

var client = dgram.createSocket('udp4');

function send(message) {
  return function(cb) {
    client.send(new Buffer(message), 0, message.length, PORT, HOST, function(err, bytes) {
      if (err) console.log(err.stack);
      cb(err);
    });
  }
}

function close() {
  client.close();
}

module.exports.send = send;
module.exports.close = close;
