// printQRCodeRaw 整個方法有問題 有空再來修
// testQRCodePrinter.js
const QRCodePrinter = require('../core/QRCodePrinter');
const qrPrinter = new QRCodePrinter();

async function testQRCodePrinting() {
    console.log('測試 ESC/POS 原始 QR 碼列印');
    qrPrinter.printQRCodeRaw('https://example.com', 4, 'L');

    // console.log('測試 ESC/POS 直接列印兩個 QR 碼');
    // qrPrinter.printDualQRCodeRaw('https://example1.com', 'https://example2.com', 3);
}

testQRCodePrinting();