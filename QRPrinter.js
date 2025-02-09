const escpos = require('escpos');
const PrinterHandler = require('./PrinterHandler');

class QRPrinter extends PrinterHandler {
  printQR(url, size = 5) {
    this.openDevice((printer) => {
      printer.qrimage(url, { type: 'png', size }, function (err) {
        if (err) {
          console.error('QR 碼打印錯誤:', err);
          return;
        }
        this.feed(2).cut().close();
        console.log('QR 碼打印完成');
      });
    });
  }
}

module.exports = QRPrinter;
