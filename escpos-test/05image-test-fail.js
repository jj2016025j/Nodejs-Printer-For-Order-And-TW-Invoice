const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const punycode = require('punycode/');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

device.open(function (error) {
  if (error) {
    console.error('打印机连接错误:', error);
    return;
  }
  escpos.Image.load('output_fixed.jpg', function (err, image) {
    if (err) {
      console.error('加载图像失败:', err);
    } else {
      printer
        .raster(image)
        // .cut();
    }
    printer.close();
  });
});
