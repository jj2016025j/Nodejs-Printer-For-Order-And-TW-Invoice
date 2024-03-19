const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

// escpos.Image.load('test.png', function(image) {
//   device.open(function() {
//     printer
//       .raster(image)
//       .close();
//   });
// });

device.open(function (error) {
  if (error) {
    console.error('打印机连接错误:', error);
    return;
  }

  escpos.Image.load('output.png', function (err, image) {
    if (err) {
      console.error('加载图像失败:', err);
      printer.close();
      return;
    }

    printer
      .raster(image)
      .close();
  });
});
