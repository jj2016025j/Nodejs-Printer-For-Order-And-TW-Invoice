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
    console.log('打印機連接成功');

    const text = "Hello, world!";
    const command = [];

    // 文本初始化命令（ESC @）
    command.push(0x1B, 0x40);

    // 将文本转换为ASCII编码，并添加到命令数组
    for (let i = 0; i < text.length; i++) {
        command.push(text.charCodeAt(i));
    }

    // 打印并换行（LF）
    command.push(0x0A);
    console.log(command);

    printer.raw(Buffer.from(command));

    // printer.cut();
    printer.close(); 
    console.log('打印機打印結束');
});
