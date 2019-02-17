var fs = require('fs');

var defaultColors = require('./defaultColors');
var ColorPalette = require('./colorPalette');

var palettes = [];
var currentPalette = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

loadPresets();

function loadPalettes()
{
    palettes[0] = new ColorPalette(defaultColors[0]);
    palettes[1] = new ColorPalette(defaultColors[1]);
    palettes[2] = new ColorPalette(defaultColors[2]);
    palettes[3] = new ColorPalette(defaultColors[3]);
    palettes[4] = new ColorPalette(defaultColors[4]);

    for(var i = 5; i < 100; ++i)
    {
        var palette = new ColorPalette();

        if (!palette.load(i))
            palette.save(i);

        palettes[i] = palette;
    }
}

loadPalettes();

function setCurrentPalette(channel, palette)
{

    if (!palette)
        palette = 0;

    if (palette > 63)
        palette = 63;
    if (palette < 0)
        palette = 0;

    midiToColor.currentPalette[channel] = palette;
    console.log('changed current palette of channel ' + (channel + 1) + ' to ' + palette);
}

function getColorFromMidiData(channel, note, velocity, volume)
{
	if (volume === undefined)
		volume = 1.0;

    var octave = (Math.floor(note / 12) + 4) % 9;
	note = note % 12;

	velocity = velocity / 127.0;

    var palette = midiToColor.currentPalette[channel];

    if (palette > 63)
        palette = 63;
    if (palette < 0)
        palette = 0;

	var hsl = palettes[palette].colors[note];

	var h = hsl[0];
	var s = hsl[1];
	var l = hsl[2];

	h = h + (octave * 0.1);
	h = h % 1.0;
	l = l * velocity * volume;

	var value = hslToRgb(h, s, l);

	return value;
}

function hslToRgb(h, s, l)
{
	var r, g, b;

    if (s == 0)
    {
        r = g = b = l;
    }
    else
    {
        var q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        var p = 2.0 * l - q;

        r = hueToRgb(p, q, h + 1.0 / 3.0);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1.0 / 3.0);
    }

    var intR = Math.round(r * 255.0) & 0xFF;
    var intG = Math.round(g * 255.0) & 0xFF;
    var intB = Math.round(b * 255.0) & 0xFF;

    return (intR << 16) + (intG << 8) + intB;
}

function hueToRgb(p, q, t)
{
    if(t < 0.0)
        t += 1.0;

    if(t > 1.0)
        t -= 1.0;

    if(t < 1.0 / 6.0)
        return p + (q - p) * 6.0 * t;

    if(t < 1.0 / 2.0)
        return q;

    if(t < 2.0 / 3.0)
        return p + (q - p) * (2.0 / 3.0 - t) * 6.0;

    return p;
}

function setColor(channel, note, color)
{
    var i = midiToColor.currentPalette[channel];

    palettes[i].setColor(note, color);
}

function savePreset(channel)
{
    var i = midiToColor.currentPalette[channel];

    palettes[i].save(i);
}


function savePresets()
{
    var l = 16 * 4;

    var buffer = new Buffer(l);

    for (var c = 0; c < 16; ++c)
    {
        var offset = 4 * c;

        var preset = currentPalette[c];
        buffer.writeInt32BE(preset, offset);
    }

    var fileName = `${__dirname}/presets/presets.bin`;

    fs.open(fileName, 'w', function(status, fd)
    {
        if (status)
        {
            console.log(status.message);
            return;
        }

        fs.write(fd, buffer, 0, l, 0, function(err, num)
        {
            console.log('saved presets');
        });
    });
}

function loadPresets()
{
    var fileName = `${__dirname}/presets/presets.bin`;

    try
    {
        fs.accessSync(fileName, 'r');
    }
    catch(e)
    {
        return false;
    }

    var fd = fs.openSync(fileName, 'r');

    var l = 16 * 4;

    var buffer = new Buffer(l);

    fs.readSync(fd, buffer, 0, l);

    for (var c = 0; c < 16; ++c)
    {
        var offset = 4 * c;

        var palette = buffer.readInt32BE(offset);

        currentPalette[c] = palette
    }

    return true;
}

var midiToColor = {
    midiToColor: getColorFromMidiData,
    loadPalettes: loadPalettes,
    palettes: palettes,
    currentPalette: currentPalette,
    setCurrentPalette: setCurrentPalette,
    setColor: setColor,
    savePreset: savePreset,
    savePresets: savePresets
};

module.exports = midiToColor;
