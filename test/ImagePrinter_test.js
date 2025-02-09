
// testQRCodePrinter.js
const ImagePrinter = require('../core/ImagePrinter');
const imagePrinter = new ImagePrinter();

async function testQRCodePrinting() {

    console.log('測試 QR 碼圖片列印');
    await imagePrinter.printQRCodeImage('https://example.com', 5);

    console.log('測試合併雙 QR 碼圖片列印');
    await imagePrinter.printMergedQRCodeImage('https://example1.com', 'https://example2.com', 5);
}

testQRCodePrinting();