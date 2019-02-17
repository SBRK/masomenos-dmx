defaultColors = [];

for(var i = 0; i < 5; ++i)
{
	defaultColors[i] = [];
}

defaultColors[0][0]  = [0.771654, 1.0, 0.543307];
defaultColors[0][1]  = [0.15748, 1.0, 0.543307];
defaultColors[0][2]  = [0.929134, 1.0, 0.543307];
defaultColors[0][3]  = [1.0, 1.0, 1.0];
defaultColors[0][4]  = [0.755906, 1.0, 0.511811];
defaultColors[0][5]  = [0.488189, 0.110236, 0.716535];
defaultColors[0][6]  = [0.165354, 1.0, 0.488189];
defaultColors[0][7]  = [0.716535, 1.0, 0.488189];
defaultColors[0][8]  = [0.330709, 1.0, 0.362205];
defaultColors[0][9]  = [0.472441, 0.110236, 0.677165];
defaultColors[0][10] = [0.330709, 1.0, 0.362205];
defaultColors[0][11] = [0.440945, 1.0, 0.535433];

defaultColors[1][0]  = [0.88189, 0.0, 0.519685];
defaultColors[1][1]  = [0.88189, 0.0, 0.519685];
defaultColors[1][2]  = [0.976378, 1.0, 1.0];
defaultColors[1][3]  = [0.976378, 1.0, 1.0];
defaultColors[1][4]  = [0.062992, 1.0, 0.543307];
defaultColors[1][5]  = [1.0, 1.0, 0.543307];
defaultColors[1][6]  = [0.322835, 1.0, 0.377953];
defaultColors[1][7]  = [0.551181, 1.0, 0.535433];
defaultColors[1][8]  = [0.551181, 1.0, 0.535433];
defaultColors[1][9]  = [0.15748, 1.0, 0.535433];
defaultColors[1][10] = [0.88189, 1.0, 0.535433];
defaultColors[1][11] = [0.15748, 1.0, 0.535433];

defaultColors[2][0] = [0.15748, 1.0, 0.984252];    // 1
defaultColors[2][1] = [0.440945, 1.0, 0.480315];   // 2
defaultColors[2][2] = [0.15748, 1.0, 0.653543];    // 3
defaultColors[2][3] = [0.440945, 1.0, 0.480315];   // 4
defaultColors[2][4] = [0.070866, 1.0, 0.535433];   // 5
defaultColors[2][5] = [0.440945, 1.0, 0.480315];   // 6
defaultColors[2][6] = [0.795276, 1.0, 0.417323];   // 7
defaultColors[2][7] = [0.338583, 1.0, 0.354331];   // 8
defaultColors[2][8] = [0.070866, 1.0, 0.535433];   // 9
defaultColors[2][9] = [1.0, 1.0, 0.535433];        // 10
defaultColors[2][10] = [1.0, 1.0, 0.535433];       // 11
defaultColors[2][11] = [0.889764, 1.0, 0.535433];  // 12

defaultColors[3][0]  = [0.889764, 1.0, 0.503937];
defaultColors[3][1]  = [0.889764, 1.0, 0.503937];
defaultColors[3][2]  = [0.070866, 1.0, 0.503937];
defaultColors[3][3]  = [0.582677, 1.0, 0.503937];
defaultColors[3][4]  = [0.0, 1.0, 0.503937];
defaultColors[3][5]  = [0.771654, 1.0, 0.503937];
defaultColors[3][6]  = [0.370079, 1.0, 0.346457];
defaultColors[3][7]  = [0.15748, 1.0, 0.511811];
defaultColors[3][8]  = [0.370079, 1.0, 0.346457];
defaultColors[3][9]  = [0.771654, 1.0, 0.503937];
defaultColors[3][10] = [0.15748, 0.0, 0.716535];
defaultColors[3][11] = [0.15748, 0.0, 1.0];

defaultColors[4][0]  = [0.181102, 1.0, 0.551181];
defaultColors[4][1]  = [0.88189, 1.0, 0.551181];
defaultColors[4][2]  = [0.88189, 0.0, 1.0];
defaultColors[4][3]  = [0.070866, 1.0, 0.551181];
defaultColors[4][4]  = [0.070866, 1.0, 0.551181];
defaultColors[4][5]  = [0.724409, 1.0, 0.551181];
defaultColors[4][6]  = [0.724409, 1.0, 0.551181];
defaultColors[4][7]  = [0.582677, 1.0, 0.551181];
defaultColors[4][8]  = [0.322835, 1.0, 0.314961];
defaultColors[4][9]  = [1.0, 1.0, 0.488189];
defaultColors[4][10] = [0.590551, 1.0, 0.488189];
defaultColors[4][11] = [0.874016, 1.0, 0.488189];

window.hslToRgb = function(h, s, l)
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

window.rgbToHsl = function(r, g, b)
{
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min)
    {
        h = s = 0; // achromatic
    }
    else
    {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}