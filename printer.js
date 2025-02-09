const escpos = require('escpos');
const { getUSBDevice } = require('./device');
const punycode = require('punycode/');

const options = { encoding: "Big5", width: 42 };

function printReceipt() {
    const device = getUSBDevice();
    const printer = new escpos.Printer(device, options);

    device.open(function (error) {
        if (error) {
            console.error('打印机连接错误:', error);
            return;
        }

        console.log('打印機連接成功');

        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
            .text('嘿!成功了!')
            .feed(3)
            .text('嘿!跳行成功了!')
            .barcode('1234567', 'EAN8')
            .table(["樺", "Two", "陞"])
            .tableCustom(
                [
                    { text:"Left", align:"LEFT", width:0.33, style: 'B' },
                    { text:"Center", align:"CENTER", width:0.33 },
                    { text:"Right", align:"RIGHT", width:0.33 }
                ],
                { encoding: 'cp857', size: [1, 1] }
            )
            .close();

        console.log('打印機打印完成');
    });
}

function printRawText(text) {
    const device = getUSBDevice();
    const printer = new escpos.Printer(device, options);

    device.open(function (error) {
        if (error) {
            console.error('打印机连接错误:', error);
            return;
        }

        console.log('打印機連接成功');

        const command = [];
        command.push(0x1B, 0x40); // 初始化指令

        for (let i = 0; i < text.length; i++) {
            command.push(text.charCodeAt(i));
        }

        command.push(0x0A); // 換行指令

        printer.raw(Buffer.from(command));
        printer.close();

        console.log('打印機打印結束');
    });
}

module.exports = { printReceipt, printRawText };
