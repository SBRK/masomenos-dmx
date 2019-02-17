function getChannel(channel)
{
	var channelDiv = document.createElement('div');

  let html = ''

	channelDiv.className = 'channel channel' + (channel + 1);

	for (var note = 0; note < 12; ++note)
	{
		html += `
      <div class="note note${note + 1}">
          <div class="dmx-note-address">
            ${getDMXAddressSelect(channel, note)}
          </div>
          ${getDMXPresetSelect(channel, note)}
        <input class="jscolor" value="000000" onchange="updateColor(this.jscolor, ${channel}, ${note});"/>
      </div>
    `;
	}

	html += getSelect(channel);

  html += `
    <div class="saveButton" onclick="sendSavePreset(${channel})">
      S
    </div>
  `;

  html += `
    <div class="ccSelect whiteSelect">
      W: ${getDMXCCSelect(channel, 'white')}
    </div>
  `;

  html += `
    <div class="ccSelect amberSelect">
      A: ${getDMXCCSelect(channel, 'amber')}
    </div>
  `;

  html += `
    <div class="ccSelect uvSelect">
      UV: ${getDMXCCSelect(channel, 'uv')}
    </div>
  `;

  channelDiv.innerHTML = html;

	return channelDiv;
};

function getDMXCCSelect(channel, value) {
  var result = `
    <select class="dmx-cc dmx-cc-${value}" id="dmx-cc-${channel}-${value}" onchange="dmxCCChange(${channel}, '${value}')">
  `;

  for (var i = 0; i < 127; ++i)
  {
    result += `
        <option value="${i}" class="dmx-cc-option-${i}">${i}</option>
    `;
  }

  result += `
    </select>
  `;

  return result;
}

function getDMXPresetSelect(channel, note) {
  var result = `
    <select class="dmx-preset" id="dmx-preset-${channel}-${note}" onchange="dmxPresetChange(${channel}, ${note})">
  `;

  for (var i = 0; i < 25; ++i)
  {
    result += `
        <option value="${i}" class="dmx-preset-option-${i}">${i}</option>
    `;
  }

  result += `
    </select>
  `;

  return result;
}

function getDMXAddressSelect(channel, note) {
  var result = `
    <select class="dmx-address" id="dmx-address-${channel}-${note}" onchange="dmxAddressChange(${channel}, ${note})">
  `;

  for (var i = 1; i < 512; ++i)
  {
    result += `
        <option value="${i}" class="dmx-address-option-${i}">${i}</option>
    `;
  }

  result += `
    </select>
  `;

  return result;
}

function getSelect(channel)
{
	var result = `
    <select class="preset" id="preset${channel}" onchange="presetChange(${channel})">
  `;

	for (var i = 0; i < 64; ++i)
	{
		result += `
        <option value="${i}">${i}</option>
    `;
	}

	result += `
    </select>
  `;

	return result;
}

function getChannels(nb)
{
	var channels = [];

	for (var channel = 0; channel < nb; ++channel)
	{
		channels[channel] = getChannel(channel);
	}

	return channels;
}

function render() {
  var matrix = document.getElementById('matrix');
  matrix.innerHTML = '';

  var channels = getChannels(5);

  for (var i = 0; i < channels.length; ++i)
  {
  	matrix.appendChild(channels[i]);
  }
}

render()
