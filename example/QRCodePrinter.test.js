// printQRCodeRaw 整個方法有問題 有空再來修
// testQRCodePrinter.js
const QRCodePrinter = require('../core/QRCodePrinter');
const qrPrinter = new QRCodePrinter();

async function testQRCodePrinting() {
    console.log('測試 ESC/POS 列印 QR 碼');
    qrPrinter.printDualQRCodeRaw('https://example1.com', 3);
}

testQRCodePrinting();