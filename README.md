# Printer
 
安裝z
選擇對應的發票機USB孔
安裝winUSB驅動

// 也是需要打印機測試  成功
const escpos = require('escpos');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type
// 這裡就會找不到打印機了
const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ }
// encoding is optional

const printer = new escpos.Printer(device, options);
console.log(printer);

// 下面會出錯
device.open(function(error){
  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .text('敏捷的棕色狐狸跳过懒狗')
  .barcode('1234567', 'EAN8')
  .table(["One", "Two", "Three"])
  .tableCustom(
    [
      { text:"Left", align:"LEFT", width:0.33, style: 'B' },
      { text:"Center", align:"CENTER", width:0.33},
      { text:"Right", align:"RIGHT", width:0.33 }
    ],
    { encoding: 'cp857', size: [1, 1] } // Optional
  )
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });
});

// 要有打印機才能測試 成功
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

// 选择USB打印机
const device = new escpos.USB();

// 创建打印机对象
const printer = new escpos.Printer(device);

// device.open(function(error){
//   printer
//     .font('a') // 选择字体
//     .align('ct') // 居中对齐
//     .style('bu') // 字体样式：粗体+下划线
//     .size(1, 1) // 字体大小
//     .text('Hello, World!') // 打印文本
//     .cut() // 切纸
//     .close(); // 关闭打印机连接
// });

device.open(function(error){
  printer
    .font('a') // 选择字体
    .align('ct') // 居中对齐
    .style('bu') // 字体样式：粗体+下划线
    .size(1, 1) // 字体大小
    .close(); // 关闭打印机连接
});
 