const ImagePrinter = require('../core/ImagePrinter');

// 初始化 ImagePrinter
const imagePrinter = new ImagePrinter();

// 列印 QR Code
imagePrinter.printQRCode("https://example.com", 4, true);

// 列印雙 QR Code
imagePrinter.printMergedQRCode("https://left.com", "https://right.com", 4, 10, true);

// 列印本地圖片
imagePrinter.printImage("C:\\Users\\User\\Github\\models\\printer\\src\\test_saved_qr.png", true);
imagePrinter.printImage("C:\\Users\\User\\Github\\models\\printer\\src\\test.png", true);
