var express = require('express');
var app = express();
var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('lodash')
var child;

var io = require('socket.io')(3333);

//var SerialPort = require('serialport').SerialPort;


var DMX = require('./dmx');
var serial = require('./serial');
var midiToColor = require('./midiToColor');
var midiToDmxPreset = require('./midiToDmxPreset');
var DSMI = require('./dsmi/index');

app.use(express.static(`${__dirname}/html`));

var isWin = /^win/.test(process.platform);

var date = new Date();
var dateStr = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

console.log('Started ' + dateStr);

var dsmi = new DSMI();
var dmx = new DMX();

dmx.connect()

var currentPage = 'synchro';

dsmi.connect();
dsmi.on('message', function(message)
{
	var type = message[0] & 0xF0;
	var channel = message[0] & 0x0F;
	var data1 = message[1];
	var data2 = message[2];

	var volume = 1.0;

	if (type == 0x90 || type == 0x80)
	{
		var velocity = type == 0x90 ? data2 : 0;
		var note = data1 % 12;

		var color = midiToColor.midiToColor(channel, data1, velocity, volume);

		sendColor(channel, note, color);
	}
	else if (type == 0xC0) //PC
	{
		var palette = data1;

		midiToColor.setCurrentPalette(channel, palette);

		if (socket)
			socket.emit('palette', {
				colors: midiToColor.palettes[palette].colors,
				channel: channel,
				palette: palette
			});

		midiToColor.savePresets();
	}
	else if (type == 0xB0) //CC
	{
		sendCC(channel, data1, data2)

		if (channel == 15 && data1 == 127)
		{
			var page = data2 < 64 ? 'synchro' : 'remote';

			if (socket && currentPage != page)
			{
				currentPage = page;

				console.log('SWITCHED TO ' + page);

				socket.emit('switch', {
					page: page
				});
			}
		}
	}
});

if (!isWin)
{
	try
	{
		exec('pkill chromium');
		exec('pkill chromium-browser');
		console.log('Killed previous Chromium processes');
	}
	catch(e)
	{
		console.error('Could not kill previous Chromium processes');
		console.error(e);
	}
}

var server = app.listen(3000, function () {
	console.log("Express server started");

	if (!isWin)
	{
		try
		{
			exec('chromium-browser -app=http://localhost:3000 --start-fullscreen --no-sandbox', function(error, stdout, stderr)
			{
			    console.log('stdout: ' + stdout);
			    console.log('stderr: ' + stderr);

			    if (error !== null)
			      console.log('exec error: ' + error);
			});
			console.log('Started Chromium process');
		}
		catch(e)
		{
			console.error('Could not start Chromium process');
			console.error(e);
		}
	}
});

var socket;


io.set('origins', '*:*');

io.on('connection', function(s){
	socket = s;
	console.log("Client connected");

	socket.on('disconnect', function()
	{
		console.log('Client disconnected');
	});

	socket.on('message', messageHandler);


  socket.emit('dmxPresets', {
    dmxPresets: midiToDmxPreset.presets,
  })

  for (var c = 0; c < 16; ++c)
  {
    var palette = midiToColor.currentPalette[c];

    socket.emit('palette',{
      colors: midiToColor.palettes[palette].colors,
      channel: c,
      palette: palette
    });

    for (var n = 0; n < 12; ++n) {
      var dmxPreset = _.get(midiToDmxPreset, ['currentDmxPresets', c, n]) || 0

      socket.emit('dmxCurrentPreset',{
        channel: c,
        note: n,
        dmxPreset,
      });

      var address = _.get(midiToDmxPreset, ['currentDmxAddresses', c, n]) || 0

      socket.emit('dmxCurrentAddress',{
        channel: c,
        note: n,
        address,
      });
    }

    socket.emit('dmxCurrentCcs', {
    	channel: c,
    	values: _.get(midiToDmxPreset, ['currentDmxCcs', c]),
    })
  }
});

var colors = [];

function messageHandler(data)
{
	if (data.type == 'paletteColor')
	{
		midiToColor.setColor(data.channel, data.note, data.color);
	}
	if (data.type == 'savePreset')
	{
		midiToColor.savePreset(data.channel);
	}
	if (data.type == 'changePreset')
	{
		midiToColor.setCurrentPalette(data.channel, data.preset);
		socket.emit('palette', {
			colors: midiToColor.palettes[data.preset].colors,
			channel: data.channel,
			palette: data.preset
		});

		midiToColor.savePresets();
	}

  if (data.type == 'changeDmxPreset') {
    midiToDmxPreset.setCurrentDmxPreset(data.channel, data.note, data.dmxPreset)
    const preset = getPreset(data.channel, data.note)
    dmx.clear(getAddress(data.channel, data.note), preset.size)
    midiToDmxPreset.saveCurrentPresets()
  }

  if (data.type == 'changeDmxAddress') {
    midiToDmxPreset.setCurrentDmxAddress(data.channel, data.note, data.address)
    midiToDmxPreset.saveCurrentAddresses()
  }

  if (data.type == 'changeDmxCC') {
    midiToDmxPreset.setCurrentDmxCc(data.channel, data.value, data.cc)
    midiToDmxPreset.saveCurrentCcs()
  }

  if (data.type == 'saveDMXPreset') {
    midiToDmxPreset.presets[data.dmxPresetIndex].save(data.dmxPresetIndex)
  }

  if (data.type == 'updateDMXValue') {
    midiToDmxPreset.presets[data.dmxPresetIndex].setParam(data.param, data.value || null)
  }

	if (data.type == 'synchroMessage')
	{
		colors[data.note][data.channel] = data.color;
	}
}

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

function sendColor(channel, note, color)
{
	if (socket)
		socket.emit('color', {channel: channel, note: note, color: color});

	var r = (color >> 16) & 0xFF;
	var g = (color >> 8) & 0xFF;
	var b = color & 0xFF;

	r = Math.floor((r / 0xFF) * 255);
	g = Math.floor((g / 0xFF) * 255);
	b = Math.floor((b / 0xFF) * 255);

  const preset = getPreset(channel, note)
  const address = getAddress(channel, note)

  if (preset) {
    dmx.sendColor({ r, g, b }, preset, address)
  }
  serial.sendColor(channel, note, color);
}

function sendCC(channel, cc, value) {
  const ccs = midiToDmxPreset.getCurrentDmxCcs(channel)
  const color = {}

  if (cc === ccs['amber']) {
    color['amber'] = Math.floor((value / 0xFF) * 255)
  }

  if (cc === ccs['white']) {
    color['white'] = Math.floor((value / 0xFF) * 255)
  }

  if (cc === ccs['uv']) {
    color['uv'] = Math.floor((value / 0xFF) * 255)
  }

  console.log('sending cc color update for channel ' + channel)
  console.log(color)

  for (var note = 0; note < 12; ++note) {
    const preset = getPreset(channel, note)
    const address = getAddress(channel, note)


    if (preset) {
      dmx.sendColor(color, preset, address)
    }
  }
}

function getPreset(channel, note) {
  const preset = midiToDmxPreset.getCurrentDmxPreset(channel, note)

  return preset
}

function getAddress(channel, note) {
  return midiToDmxPreset.getCurrentDmxAddress(channel, note)
}

var values = [];

function resetValues()
{
	for (var c = 0; c < 16; ++c)
	{
		values[c] = [];

		for (var cc = 0; cc < 127; ++cc)
			values[c][cc] = -1;
	}
}

resetValues();

var mutex = 0;

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

	resetColors();
}

var pendingMessages = 0;

var startTime = new Date().getTime();

resetColors();

setInterval(sendPendingMessages, 20);
setInterval(resetValues, 1000);

const acolors = [
  0xFF0000,
  0x00FF00,
  0x0000FF,
  0xFFFF00,
  0xFF00FF,
  0x00FFFF,
  0X000000
]

/*setInterval(() => {
  sendColor(1, 1, _.sample(acolors))
}, 1000)*/
