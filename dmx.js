var DMX = require('dmx')
var SerialPort = require('serialport')
var _ = require('lodash')
var Promise = require('bluebird')

const listSerialPort = Promise.promisify(SerialPort.list)

class DmxUniverse {

  async connect() {
    try {
      const list = await listSerialPort()

      console.log(list)

      if (!list.length) {
        console.log('DMX interface not found !')
        return null
      }

      const manufacturers = ['FTDI', 'ENTTEC']

      const port = _.find(list, p => _.includes(manufacturers, p.manufacturer))

      const dmx = new DMX()

      if (port) {
        this.universe = dmx.addUniverse('masomenos', 'enttec-usb-dmx-pro', port.comName)
        this.reset()
      }

      return this
    } catch (err) {
      console.error(err)

      return null
    }
  }

  reset() {
  	if (!this.universe) {
  	  return
  	}

    const cleared = {}
    _.times(512, n => cleared[n] = 0)

    this.universe.update(cleared)
  }

  clear(address, size) {
  	if (!this.universe) {
  	  return
  	}

    const message = {}
    _.times(size, n => message[address + n] = 0)

    console.log(message)

    this.universe.update(message)
  }

  sendColor(color = {}, dmxPreset = {}, address = 1) {
    if (!this.universe) {
      return
    }

    const message = {}

    const {
      r,
      g,
      b,

      white,
      amber,
      uv,
    } = color

    const {
      offsets: {
        r: rOffset,
        g: gOffset,
        b: bOffset,

        white: whiteOffset,
        amber: amberOffset,
        uv: uvOffset,

        intensity: intensityOffset,
      } = {}
    } = dmxPreset

    if (!_.isUndefined(r) && !_.isUndefined(rOffset)) {
      message[address + rOffset] = r
    }

    if (!_.isUndefined(g) && !_.isUndefined(gOffset)) {
      message[address + gOffset] = g
    }

    if (!_.isUndefined(b) && !_.isUndefined(bOffset)) {
      message[address + bOffset] = b
    }

    if (!_.isUndefined(white) && !_.isUndefined(whiteOffset)) {
      message[address + whiteOffset] = white
    }

    if (!_.isUndefined(amber) && !_.isUndefined(amberOffset)) {
      message[address + amberOffset] = amber
    }

    if (!_.isUndefined(uv) && !_.isUndefined(uvOffset)) {
      message[address + uvOffset] = uv
    }


    if (!_.isUndefined(intensityOffset)) {
      message[address + intensityOffset] = 255
    }

    // console.log(message)


    this.universe.update(message)
  }
}

module.exports = DmxUniverse
