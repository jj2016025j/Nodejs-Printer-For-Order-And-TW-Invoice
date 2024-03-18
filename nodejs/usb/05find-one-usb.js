// 庫裡面的usb庫版本不符合 無法使用 改完庫原本的錯誤不會出現了 但會出現權限問題 
// 安裝驅動後可以了  用VID跟PID找不到
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const Printer = escpos.USB.findPrinter()
console.log(Printer)// []

 // 示例VID和PID，请替换为你的打印机的实际值
const device = new escpos.USB("1FC9", "2016");
console.log(device);

// 會出現權限問題
device.open();
device.getStringDescriptor(device.deviceDescriptor.iManufacturer, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Manufacturer:', data);
  }
  device.close();
});
