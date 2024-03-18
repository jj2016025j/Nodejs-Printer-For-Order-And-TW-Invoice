// 要有打印機才能測試
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

// 选择USB打印机
const device = new escpos.USB();

// 创建打印机对象
const printer = new escpos.Printer(device);

device.open(function(error){
  printer
    .font('a') // 选择字体
    .align('ct') // 居中对齐
    .style('bu') // 字体样式：粗体+下划线
    .size(1, 1) // 字体大小
    .text('Hello, World!') // 打印文本
    .cut() // 切纸
    .close(); // 关闭打印机连接
});
 