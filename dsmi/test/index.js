var DSMI = require('../index.js');

var dsmi = new DSMI();

dsmi.connect();
dsmi.on('message', function(message)
{
	console.log('message', message[0], message[1], message[2]);
});

setInterval(function(){dsmi.sendMidiMessage(0xB0, 5, 64)}, 2000);
