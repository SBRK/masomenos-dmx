IoHandler = {
	connected: false,
	onmessage: function(data){console.log(data);}
};

var socket = io('http://' + location.hostname + ':3333');

socket.on('connect', function ()
{
	IoHandler.connected = true;
	console.log("Socket.io connected");

	document.getElementById('connected').style.display = 'block';
	document.getElementById('not-connected').style.display = 'none';

	resetAll();
});

socket.on('message', function (data)
{
	IoHandler.onmessage(data);
});

socket.on('disconnect', function (data)
{
	console.error("Socket.io disconnected");
	IoHandler.connected = false;

	document.getElementById('connected').style.display = 'none';
	document.getElementById('not-connected').style.display = 'block';
});

IoHandler.sendMessage = function(message)
{
	if (!IoHandler.connected)
		return;

	socket.send(message);
}


socket.on('switch', function (data)
{
	if (data.page == 'remote')
		document.location = '/remote.html';
});