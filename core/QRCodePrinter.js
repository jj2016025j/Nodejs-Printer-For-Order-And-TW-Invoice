// printQRCodeRaw 整個方法有問題 有空再來修
// QRCodePrinter.js
const PrinterHandler = require('./PrinterHandler');

class QRCodePrinter extends PrinterHandler {
    /**
     * 直接列印 QR 碼（ESC/POS 指令） 整個方法有問題 有空再來修
     */
    printQRCodeRaw(data, size = 4, errorCorrection = 'L', cut = false) {
        this.openDevice((printer) => {
            let commands = [];

            // QR Code 初始化
            commands.push(...[0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]);

            // 設定 QR Code 模塊大小
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size]);

            // 設定錯誤校正級別
            const errorCorrectionMap = { 'L': 0x30, 'M': 0x31, 'Q': 0x32, 'H': 0x33 };
            const errorCorrectionValue = errorCorrectionMap[errorCorrection] || 0x30;
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, errorCorrectionValue]);

            // 檢查數據長度
            let dataBytes = Buffer.from(data);
            if (dataBytes.length > 255) {
                console.error("❌ QR Code 數據過長，請縮短內容");
                return;
            }

            // 設定 QR Code 數據
            let pL = dataBytes.length % 256;
            let pH = Math.floor(dataBytes.length / 256);
            commands.push(...[0x1D, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30], ...dataBytes);

            // 列印 QR Code
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]);

            // 加入換行 & 送出指令
            commands.push(0x0A);
            printer.raw(Buffer.from(commands));
            printer.feed(2);
            printer.flush();  // 確保指令發送

            // 等待一點時間再切紙（某些機型需要）
            setTimeout(() => {
                if (cut) printer.cut();
                printer.close();
                console.log('✅ QR 碼打印完成');
            }, 100);
        });
    }


    /**
     * 直接列印兩個並排的 QR 碼（ESC/POS 指令） 應該會變成兩行?
     */
    printDualQRCodeRaw(leftQRData, rightQRData, size = 4, cut = false) {
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

