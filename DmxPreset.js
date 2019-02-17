var fs = require('fs')

function DmxPreset(name = 'dmx', size = 3, offsets = { r: 0, g: 1, b: 2 }) {
  this.name = name
  this.size = size
  this.offsets = offsets
}

DmxPreset.prototype.setParam = function(param, value = null) {
  if (param === 'name') {
    this.name = value
  } else if (param === 'size') {
    this.size = parseInt(value)
  } else {
    if (!value) {
      delete this.offsets[param]
    } else {
      this.offsets[param] = parseInt(value)
    }
  }

  return this
}

DmxPreset.prototype.save = function(preset) {
  const {
    size,
    offsets,
    name,
  } = this

  const data = {
    offsets,
    size,
    name,
  }

  fs.writeFileSync(`${__dirname}/presets/dmx_${preset}.json`, JSON.stringify(data, null, 2), 'utf8')
}

DmxPreset.prototype.load = function(preset)
{
  var fileName = `${__dirname}/presets/dmx_${preset}.json`

  try
  {
    fs.accessSync(fileName, 'r')
  }
  catch(e)
  {
    console.log(e);
    return false
  }

  try {
    const data = fs.readFileSync(fileName, 'utf8')

    obj = JSON.parse(data)

    this.offsets = obj.offsets
    this.name = obj.name
    this.size = obj.size

    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = DmxPreset
