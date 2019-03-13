const sleep = t => new Promise(cb => setTimeout(cb, t))

IoHandler = {
	connected: false,
	onmessage: function(data){console.log(data);}
};

let socket

function initSocket() {
  socket = io('http://' + location.hostname + ':3333');

  socket.on('connect', function ()
  {
  	IoHandler.connected = true;
  	console.log("Socket.io connected");

  	document.getElementById('connected').style.display = 'block';
  	document.getElementById('not-connected').style.display = 'none';
  	document.getElementById('matrix').className = 'connected';

  	setTimeout(function()
  	{
  		resetAll();
  	}, 10);
  });

  socket.on('message', function (data)
  {
  	IoHandler.onmessage(data);
  });

  socket.on('color', function (data)
  {
  	setColor(data.channel, data.note, data.color);
  });

  socket.on('palette', function (data)
  {
    for(var n = 0; n < 12; n++)
    {
      var c = data.colors[n];

      setPaletteColor(data.channel, n, hslToRgb(c[0], c[1], c[2]), data.palette);
    }
  });

  socket.on('dmxCurrentPreset', function (data)
  {
    setDmxPreset(data.channel, data.note, data.dmxPreset)
  });

  socket.on('dmxCurrentAddress', function (data)
  {
    setDmxAddress(data.channel, data.note, data.address)
  });


  socket.on('dmxCurrentCcs', function (data)
  {
    setDmxCcs(data.channel, data.values)
  });

  socket.on('dmxPresets', async function (data)
  {
    window.dmxPresets = data.dmxPresets

    const dmxEditorPresetSelection = document.getElementById('dmxEditorSelect')

    let dmxEditorOptions = ''

    for (var i = 0; i < data.dmxPresets.length; ++i) {
      const options = document.getElementsByClassName(`dmx-preset-option-${i}`)

      for (var j = 0; j < options.length; ++j) {
        if (options[j] && options[j].innerHTML !== data.dmxPresets[i].name) {
          options[j].innerHTML = data.dmxPresets[i].name
        }
      }

      dmxEditorOptions += `<option value="${i}">${data.dmxPresets[i].name}</option>`
      await sleep(0)
    }

    dmxEditorSelect.innerHTML = dmxEditorOptions

    selectDMXPresetForEdition(0)
  });

  socket.on('switch', function (data)
  {
    if (data.page == 'synchro')
      document.location = '/index.html';
  });

  socket.on('disconnect', function (data)
  {
    console.error("Socket.io disconnected");
    IoHandler.connected = false;

    document.getElementById('connected').style.display = 'none';
    document.getElementById('not-connected').style.display = 'block';
    document.getElementById('matrix').className = '';
  });
}

function dmxEditorSelectChange() {
  const value = document.getElementById('dmxEditorSelect').value

  selectDMXPresetForEdition(value)
}

function dmxNameChange() {
  const value = document.getElementById('dmxEditorName').value

  updateDMXValue('name', value)
}

function dmxSizeChange() {
  const value = document.getElementById('dmxEditorSize').value

  updateDMXValue('size', value)
}

function dmxRChange() {
  const value = document.getElementById('dmxEditorR').value

  updateDMXValue('r', value)
}

function dmxGChange() {
  const value = document.getElementById('dmxEditorG').value

  updateDMXValue('g', value)
}

function dmxBChange() {
  const value = document.getElementById('dmxEditorB').value

  updateDMXValue('b', value)
}

function dmxAmberChange() {
  const value = document.getElementById('dmxEditorAmber').value

  updateDMXValue('amber', value)
}

function dmxIntensityChange() {
  const value = document.getElementById('dmxEditorIntensity').value

  updateDMXValue('intensity', value)
}

function dmxUVChange() {
  const value = document.getElementById('dmxEditorUv').value

  updateDMXValue('uv', value)
}

function dmxWhiteChange() {
  const value = document.getElementById('dmxEditorWhite').value

  updateDMXValue('white', value)
}

function updateDMXValue(param, value) {
  const i = document.getElementById('dmxEditorSelect').value

  IoHandler.sendMessage({
    type: 'updateDMXValue',
    dmxPresetIndex: i,
    param,
    value,
  })
}

function dmxSavePreset() {
  const i = document.getElementById('dmxEditorSelect').value

  IoHandler.sendMessage({
    type: 'saveDMXPreset',
    dmxPresetIndex: i,
  })
}

function selectDMXPresetForEdition(i) {
  const preset = window.dmxPresets[i]

  document.getElementById('dmxEditorName').value = preset.name || 'dmx'
  document.getElementById('dmxEditorSize').value = preset.size || 1
  document.getElementById('dmxEditorR').value = preset.offsets.r !== undefined ? preset.offsets.r : ''
  document.getElementById('dmxEditorG').value = preset.offsets.g !== undefined ? preset.offsets.g : ''
  document.getElementById('dmxEditorB').value = preset.offsets.b !== undefined ? preset.offsets.b : ''
  document.getElementById('dmxEditorWhite').value = preset.offsets.white !== undefined ? preset.offsets.white : ''
  document.getElementById('dmxEditorAmber').value = preset.offsets.amber !== undefined ? preset.offsets.amber : ''
  document.getElementById('dmxEditorUv').value = preset.offsets.uv !== undefined ? preset.offsets.uv : ''
  document.getElementById('dmxEditorIntensity').value = preset.offsets.intensity !== undefined ? preset.offsets.intensity : ''
}

IoHandler.sendMessage = function(message)
{
	if (!IoHandler.connected)
		return;

	socket.send(message);
}
