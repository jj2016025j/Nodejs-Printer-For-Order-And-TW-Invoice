const escpos = require('escpos');
escpos.USB = require('escpos-usb');

function getUSBDevice() {
    return new escpos.USB();
}

module.exports = { getUSBDevice };
