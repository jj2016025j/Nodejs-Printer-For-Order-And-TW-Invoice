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

    let commands = [];

    // 选择二维码模型（假设选择模型2）
    commands.push(...[0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]);

    // 设置二维码大小（放大倍数，这里选择约1.5厘米大小的设置，实际效果需测试调整）
    commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, 0x03]);

    // 设置二维码的错误校正等级（假设选择等级L）
    commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30]);

    // 存储要编码的数据
    let data = "Hello, QR!";
    let dataBytes = Buffer.from(data);
    let pL = dataBytes.length % 256;
    let pH = Math.floor(dataBytes.length / 256);
    commands.push(...[0x1D, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30], ...dataBytes);

    // 打印二维码
    commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]);
    commands.push(0x0A);
    console.log(commands);

    // 发送命令
    printer.raw(Buffer.from(commands));

    // 执行切纸操作
    // printer.cut();

    // 完成打印
    printer.close();
    console.log('打印機打印結束');
});
