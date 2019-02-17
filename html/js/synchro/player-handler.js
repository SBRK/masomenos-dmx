var playButton = document.getElementById('play-button');
var pauseButton = document.getElementById('pause-button');
var seekBar = document.getElementById('seek-bar');


playButton.addEventListener('click', function(event)
{
	IoHandler.sendMessage({
		type: 'play'
	});
});

pauseButton.addEventListener('click', function(event)
{
	IoHandler.sendMessage({
		type: 'pause'
	});
});

IoHandler.onmessage = function(message)
{
	if (message.type == 'synchro')
	{
		var percentage = Math.round(message.position * 100);

		seekBar.style.width = percentage + "%";
	}
	else if (message.type == 'switch')
	{
		if (message.page == 'remote')
			document.location = '/remote.html';
	}
}