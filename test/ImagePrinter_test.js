const ImagePrinter = require('../core/ImagePrinter');

// 初始化 ImagePrinter
const imagePrinter = new ImagePrinter();

imagePrinter.printQRCode('https://example.com');
imagePrinter.printMergedQRCodes('左側 QR Code 內容', '右側 QR Code 內容');
imagePrinter.printImage('C:\\Users\\User\\Github\\models\\printer\\src\\test_saved_qr.png');
imagePrinter.printImage('C:\\Users\\User\\Github\\models\\printer\\src\\test.png');
