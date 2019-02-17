var fs = require('fs');
const _ = require('lodash')

var DmxPreset = require('./DmxPreset');

const presets = []

let currentDmxPresets = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

let currentDmxAddresses = [
  [1, 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89],
  [101, 109, 117, 125, 133, 141, 149, 157, 165, 173, 181, 189],
  [201, 209, 217, 225, 233, 241, 249, 257, 265, 273, 281, 289],
  [301, 309, 317, 325, 333, 341, 349, 357, 365, 373, 381, 389],
  [401, 409, 417, 425, 433, 441, 449, 457, 465, 473, 481, 489],
  [501, 509, 517, 525, 533, 541, 549, 557, 565, 573, 581, 589],
]

let currentDmxCcs = [
  { white: 21, amber: 22, uv: 23 },
  { white: 21, amber: 22, uv: 23 },
  { white: 21, amber: 22, uv: 23 },
  { white: 21, amber: 22, uv: 23 },
  { white: 21, amber: 22, uv: 23 },
]

function loadDmxPresets() {
  for(var i = 0; i < 50; ++i)
  {
    var dmxPreset = new DmxPreset();


    if (!dmxPreset.load(i))
      dmxPreset.save(i);

    console.log(dmxPreset.name)

    presets[i] = dmxPreset;
  }


}

loadDmxPresets();

function setCurrentDmxPreset(channel, note, dmxPreset = 0) {
  midiToDmxPreset.currentDmxPresets[channel][note] = dmxPreset;
  console.log('changed currentDmxPresets of channel ' + (channel + 1) + ' note ' + note +  ' to ' + dmxPreset);
}

function setCurrentDmxCc(channel, value, cc = 0) {
  midiToDmxPreset.currentDmxCcs[channel][value] = cc;
  console.log('changed currentDmxCc of channel ' + (channel + 1) + ' value ' + value +  ' to ' + cc);
}

function setCurrentDmxAddress(channel, note, address = 0) {
  midiToDmxPreset.currentDmxAddresses[channel][note] = address;
  console.log('changed currentDmxAddress of channel ' + (channel + 1) + ' note ' + note +  ' to ' + address);
}

function getCurrentDmxPreset(channel, note) {
  const i = _.get(currentDmxPresets, [channel, note]) || 0

  return _.get(presets, i) || null
}

function getCurrentDmxCcs(channel) {
  return _.get(currentDmxCcs, channel) || { white: 21, amber: 22, uv: 23 }
}

function getCurrentDmxAddress(channel, note) {
  return _.get(currentDmxAddresses, [channel, note]) || (1 + (channel * 100) + (note * 8))
}

function savePreset(i) {
  console.log(presets)
  presets[i].save(i);
}


function saveCurrentPresets() {
  var fileName = `${__dirname}/presets/currentDmxPresets.json`;

  const data = currentDmxPresets

  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8')
}


function saveCurrentCcs() {
  var fileName = `${__dirname}/presets/currentDmxCcs.json`;

  const data = currentDmxCcs

  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8')
}


function saveCurrentAddresses() {
  var fileName = `${__dirname}/presets/currentDmxAddresses.json`;

  const data = currentDmxAddresses

  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8')
}

function loadCurrentPresets() {
  var fileName = `${__dirname}/presets/currentDmxPresets.json`;

  try
  {
    fs.accessSync(fileName, 'r')
  }
  catch(e)
  {
    return false
  }

  const data = fs.readFileSync(fileName, 'utf8')

  currentDmxPresets = JSON.parse(data)
}

function loadCurrentCcs() {
  var fileName = `${__dirname}/presets/currentDmxCcs.json`;

  try
  {
    fs.accessSync(fileName, 'r')
  }
  catch(e)
  {
    return false
  }

  const data = fs.readFileSync(fileName, 'utf8')

  currentDmxCcs = JSON.parse(data)
}

function loadCurrentAddresses() {
  var fileName = `${__dirname}/presets/currentDmxAddresses.json`;

  try
  {
    fs.accessSync(fileName, 'r')
  }
  catch(e)
  {
    return false
  }

  const data = fs.readFileSync(fileName, 'utf8')

  currentDmxAddresses = JSON.parse(data)
}

loadCurrentPresets()
loadCurrentCcs()
loadCurrentAddresses()

var midiToDmxPreset = {
    loadDmxPresets,
    loadCurrentPresets,
    loadCurrentCcs,
    loadCurrentAddresses,
    presets,
    currentDmxPresets,
    currentDmxCcs,
    currentDmxAddresses,
    getCurrentDmxPreset,
    getCurrentDmxAddress,
    getCurrentDmxCcs,
    setCurrentDmxPreset,
    setCurrentDmxAddress,
    setCurrentDmxCc,
    savePreset,
    saveCurrentPresets,
    saveCurrentAddresses,
    saveCurrentCcs,
};

module.exports = midiToDmxPreset;
