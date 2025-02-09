const QRCodePrinter = require('./QRCodePrinter');

const printer = new QRCodePrinter();

// 測試列印兩個 QR 碼，確保對齊
printer.printDualQRCode("https://github.com/jj2016025j/", "https://github.com/jj2016025j/", 5);
