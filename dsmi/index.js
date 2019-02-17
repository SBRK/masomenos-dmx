const dgram = require('dgram');


var DSMI_PC_PORT = 9000;
var DSMI_NODE_PORT = 9001;
var DSMI_NODE_SENDER_PORT = 9002;

var BROADCAST_ADDR = '255.255.255.255';

function DSMI()
{
	this.connected = false;
}

var sendKeepAlive = function(dsmi)
{
	if (dsmi.connected)
		dsmi.sendMidiMessage(0, 0, 0);
}

var interval = 0;

DSMI.prototype.connect = function()
{
	var self = this;

	this.inSocket  = dgram.createSocket('udp4');
	this.outSocket = dgram.createSocket('udp4');

	var resetConnection = function()
	{
		self.inSocket.close();
		self.outSocket.close();

		self.connected = false;
		self.inConnected = false;
		self.outConnected = false;

		if (self.interval)
			clearInterval(self.interval);

		self.connect();
	}

	var checkConnection = function()
	{
		if (self.inConnected && self.outConnected)
		{
			self.connected = true;

			if (self.interval)
				clearInterval(interval);

			interval = setInterval(sendKeepAlive, 1000, self);
		}
	}

	this.inSocket.on('error', function(err)
	{
		console.error('in socket error: ', err);

		resetConnection();
	});

	this.outSocket.on('error', function(err)
	{
		console.error('out socket error: ', err);

		resetConnection();
	});

	this.inSocket.on('message', function(msg, rinfo)
	{
		if (msg && msg.length == 3)
		{
			var b0 = msg.readUInt8(0);
			var b1 = msg.readUInt8(1);
			var b2 = msg.readUInt8(2);

			var message = [b0, b1, b2];

			var h = handlers['message'];

			for(var i = 0; i < h.length; ++i)
			{
				h[i](message);
			}
		}
	});

	this.inSocket.on('listening', function()
	{
		self.inAddress = self.inSocket.address();
		console.log('in listening', self.inAddress.address, ':', self.inAddress.port);

		self.inConnected = true;

		checkConnection();
	});

	this.outSocket.on('listening', function()
	{
		self.outAddress = self.outSocket.address();
		console.log('out listening', self.outAddress.address, ':', self.outAddress.port);

		self.outSocket.setBroadcast(true);
		self.outConnected = true;

		checkConnection();
	});

	this.inSocket.bind(DSMI_NODE_PORT);
	this.outSocket.bind(DSMI_NODE_SENDER_PORT);
}

DSMI.prototype.sendMidiMessage = function(message, data1, data2)
{
	var data = new Buffer(3);

	data.writeUInt8(message & 0xFF, 0);
	data.writeUInt8(data1 & 0xFF, 1);
	data.writeUInt8(data2 & 0xFF, 2);

	this.outSocket.send(data, 0, 3, DSMI_PC_PORT, BROADCAST_ADDR);
}

var handlers = {
	'message': [],
	'cc': [],
	'noteon': [],
	'noteoff': [],
	'connected': []
};

DSMI.prototype.on = function(event, callback)
{
	if (handlers[event])
		handlers[event].push(callback);
}

module.exports = DSMI;