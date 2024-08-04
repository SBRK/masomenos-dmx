var SerialPort = require('serialport');

var values = [];
var colors = [];

function resetValues()
{
	for (var c = 0; c < 16; ++c)
	{
		values[c] = [];

		for (var cc = 0; cc < 127; ++cc)
			values[c][cc] = -1;
	}

	/*if (pendingMessages > 0)
		console.log(((pendingMessages * 3) / 0.125) / 31250);*/

	pendingMessages = 0;
}

resetValues();

function resetColors()
{
	for(var n = 0; n < 12; ++n)
	{
		colors[n] = [];
		for(var c = 0; c < 5; ++c)
		{
			colors[n][c] = -1;
		}
	}
}

resetColors();

function sendColor(channel, note, color)
{
	var r = (color >> 16) & 0xFF;
	var g = (color >> 8) & 0xFF;
	var b = color & 0xFF;

	r = Math.floor((r / 0xFF) * 127);
	g = Math.floor((g / 0xFF) * 127);
	b = Math.floor((b / 0xFF) * 127);

	sendCC(channel, (note * 3) + 1,     r);
	sendCC(channel, (note * 3) + 2, g);
	sendCC(channel, (note * 3) + 3, b);
}

function sendCC(channel, cc, value)
{
	var message = new Buffer(3);

	if (values[channel][cc] == value)
		return;

	values[channel][cc] = value;

	message[0] = 0xB0 + channel;
	message[1] = cc & 0xFF;
	message[2] = value & 0xFF;

	sendMessage(message);
}

function sendMessage(message)
{
	if (!serialPortOpen)
		return;

	pendingMessages++;

	serialPort.write(message);
}

var serialPortOpen = false;

var serialPort = new SerialPort("/dev/ttyAMA0", {
	baudRate: 38400,
	bufferSize: 16
});

serialPort.on("open", function ()
{
	console.log("Serial port open");
	serialPortOpen = true;
});

serialPort.on('close', function()
{
	console.log("Serial port closed");
	serialPortOpen = false;
});

serialPort.on('error', function(err)
{
	console.log('Serial port error ', err);
});

var pendingMessages = 0;

function sendPendingMessages()
{
	for(var n = 0; n < 12; ++n)
	{
		for(var c = 0; c < 5; ++c)
		{
			var color = colors[n][c];

			if (color != -1)
			{
				sendColor(c, n, color);
			}
		}
	}

	if (serialPortOpen)
		serialPort.flush();

	resetColors();
}

setInterval(sendPendingMessages, 20);
setInterval(resetValues, 1000);

module.exports = {
    sendMessage,
    sendColor,
    sendCC,
}