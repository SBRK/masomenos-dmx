var fs = require('fs');

function ColorPalette(colors)
{
	this.colors = [];

	for (var n = 0; n < 12; ++n)
	{
		var h = Math.random() * 1.0;
		var s = 1.0;
		var l = 0.5;

		if (colors !== undefined && colors[n])
		{
			h = colors[n][0];
			s = colors[n][1];
			l = colors[n][2];
		}

		this.colors[n] = [h, s, l];
	}
};

ColorPalette.prototype.setColor = function(note, color)
{
	this.colors[note] = [color[0], color[1], color[2]];
}

ColorPalette.prototype.save = function(preset)
{
    var l = 12 * 3 * 4;

    var buffer = new Buffer(l);

	for (var n = 0; n < 12; ++n)
	{
		var offset = (3 * 4) * n;

		var color = this.colors[n];

		buffer.writeFloatBE(color[0], offset);
		buffer.writeFloatBE(color[1], offset + 4);
		buffer.writeFloatBE(color[2], offset + 8);
	}

	var fileName = `${__dirname}/presets/${preset}.bin`;

	fs.open(fileName, 'w', function(status, fd)
	{
	    if (status)
	    {
	        console.log(status.message);
	        return;
	    }

		fs.write(fd, buffer, 0, l, 0, function(err, num)
		{
			console.log('saved preset ' + preset);
		});
	});
}

ColorPalette.prototype.load = function(preset)
{
	var self = this;
	var fileName = `${__dirname}/presets/${preset}.bin`;

	try
	{
		fs.accessSync(fileName, 'r');
	}
	catch(e)
	{
		return false;
	}

	var fd = fs.openSync(fileName, 'r');

    var l = 12 * 3 * 4;

    var buffer = new Buffer(l);

	fs.readSync(fd, buffer, 0, l);

	for (var n = 0; n < 12; ++n)
	{
		var offset = (3 * 4) *  n;

		var h = buffer.readFloatBE(offset);
		var s = buffer.readFloatBE(offset + 4);
		var l = buffer.readFloatBE(offset + 8);

		self.colors[n] = [h, s, l];
	}

	return true;
}

module.exports = ColorPalette;
