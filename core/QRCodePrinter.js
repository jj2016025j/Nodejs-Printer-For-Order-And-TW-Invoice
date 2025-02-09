// QRCodePrinter.js
const PrinterHandler = require('./PrinterHandler');

class QRCodePrinter extends PrinterHandler {
    /**
     * 直接列印 QR 碼（ESC/POS 指令）
     */
    printQRCodeRaw(data, size = 5, errorCorrection = 'L', cut = false) {
        this.openDevice((printer) => {
            let commands = [];
            commands.push(...[0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]);
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size]);
            const errorCorrectionMap = { 'L': 0x30, 'M': 0x31, 'Q': 0x32, 'H': 0x33 };
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, errorCorrectionMap[errorCorrection] || 0x30]);
            let dataBytes = Buffer.from(data);
            let pL = dataBytes.length % 256;
            let pH = Math.floor(dataBytes.length / 256);
            commands.push(...[0x1D, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30], ...dataBytes);
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]);
            commands.push(0x0A);
            printer.raw(Buffer.from(commands));
            if (cut) printer.cut();
            printer.close();
            console.log('QR 碼打印完成');
        });
    }

    /**
     * 直接列印兩個並排的 QR 碼（ESC/POS 指令）
     */
    printDualQRCodeRaw(leftQRData, rightQRData, size = 5, cut = false) {
        this.openDevice((printer) => {
            printer.align('lt'); // 左對齊
            printer.qrimage(leftQRData, { type: 'png', size }, (err) => {
                if (err) {
                    console.error('打印左側 QR 碼失敗:', err);
                    return;
                }
                printer.text(' '.repeat(4)); // 增加間距
                printer.align('rt'); // 右對齊
                printer.qrimage(rightQRData, { type: 'png', size }, (err) => {
                    if (err) {
                        console.error('打印右側 QR 碼失敗:', err);
                        return;
                    }
                    printer.feed(2);
                    if (cut) printer.cut();
                    printer.close();
                    console.log('QR 碼打印完成');
                });
            });
        });
    }
}

module.exports = QRCodePrinter;

