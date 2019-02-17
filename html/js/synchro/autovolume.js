function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0)==' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length,c.length);
        }
    }
    return null;
}

var volumeMin = getCookie('volumeMin') || 0.5;
var volumeMax = getCookie('volumeMax') || 0.8;

var volumeMinAfter = getCookie('volumeMinAfter') || 0; // Volume min will be set after this time (ex: 23 => after 23:00 volume min is set)
var volumeMinBefore = getCookie('volumeMinBefore') || 8; // Volume max will be set after this time (ex: 8 => after 08:00 volume min is set)


setInterval(function()
{
	if (!autoVolumeEnabled)
		return;

	var date = new Date();

	var hour = date.getHours();

	var shouldBeVolumeMin = false;

	if (volumeMinAfter < volumeMinBefore)
	{
		if (hour >= volumeMinAfter && hour <= volumeMinBefore)
			shouldBeVolumeMin = true;
		else
			shouldBeVolumeMin = false;
	}
	else
	{
		if (hour >= volumeMinAfter && hour <= 23)
			shouldBeVolumeMin = true;
		else if (hour <= volumeMinBefore && hour >= 0)
			shouldBeVolumeMin = true;
		else
			shouldBeVolumeMin = false;
	}

	if (shouldBeVolumeMin && audio.volume > volumeMin)
	{
		audio.volume = volumeMin;
	}
	else if (!shouldBeVolumeMin && audio.volume > volumeMax)
	{
		audio.volume = volumeMax;
	}
}, 1000);

var autoVolumeEnabled = true;

var volumeMinEl = document.getElementById('volumeMin');
var volumeMaxEl = document.getElementById('volumeMax');
var startTimeEl = document.getElementById('startTime');
var endTimeEl = document.getElementById('endTime');

function toggleAutoVolume()
{
	autoVolumeEnabled = !autoVolumeEnabled;

	document.getElementById('autovolume-on').style.display = autoVolumeEnabled ? 'inline' : 'none';
	document.getElementById('autovolume-off').style.display = autoVolumeEnabled ? 'none' : 'inline';
}

function volumeMinValueChanged(event)
{
	var value = parseFloat(volumeMinEl.value);

	volumeMin = value;

	document.cookie = "volumeMin=" + volumeMinEl.value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function volumeMaxValueChanged(event)
{
	var value = parseFloat(volumeMaxEl.value);

	volumeMax = value;

	document.cookie = "volumeMax=" + volumeMaxEl.value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function startTimeValueChanged(event)
{
	var value = parseFloat(startTimeEl.value);

	volumeMinAfter = value;

	document.cookie = "volumeMinAfter=" + startTimeEl.value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function endTimeValueChanged(event)
{
	var value = parseFloat(endTimeEl.value);

	volumeMinBefore = value;
	
	document.cookie = "volumeMinBefore=" + endTimeEl.value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}


volumeMinEl.addEventListener('change', volumeMinValueChanged);
volumeMaxEl.addEventListener('change', volumeMaxValueChanged);
startTimeEl.addEventListener('change', startTimeValueChanged);
endTimeEl.addEventListener('change', endTimeValueChanged);

volumeMinEl.value = volumeMin.toString();
volumeMaxEl.value = volumeMax.toString();
startTimeEl.value = volumeMinAfter.toString();
endTimeEl.value = volumeMinBefore.toString();