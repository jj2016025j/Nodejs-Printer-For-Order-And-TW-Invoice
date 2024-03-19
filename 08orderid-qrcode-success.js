// 生成訂單編號或桌號 成功 size: 10 大約3公分
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const qr = require('qr-image');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

device.open(function (error) {
    if (error) {
        console.error('打印機連接錯誤:', error);
        return;
    }
    console.log('打印機連接成功');

    // 假设订单编号为"A78146133"，桌号为"12"
    printOrderWithQR("A78146133", "12");

    printer.close();
});

function printOrderWithQR(orderNumber, tableNumber) {

    // 根据订单编号和桌号生成QR码的内容
    const qrContent = `https://lee871116.ddns.net/${orderNumber}`;

    // const qrCode = qr.imageSync(qrContent, { type: 'png', size: 10 });

    printer
        .font('a')
        .align('ct')
        .size(1, 1)
        .text('Fang Food芳鍋')
        .size(0, 0)
        .text(`桌號: ${tableNumber}`)
        .text(`訂單編號: ${orderNumber}`)
        .text('-------------------------')
        .qrimage(qrContent, { type: 'png', size: 10 }, function (err) {
            this.feed(2)
            // this.cut();
            this.close();
        });
    console.log('打印完成');
}