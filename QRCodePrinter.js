const PrinterHandler = require('./PrinterHandler');
const QRCodeGenerator = require('./QRCodeGenerator');
const fs = require('fs');

class QRCodePrinter extends PrinterHandler {
    /**
     * 列印 QR 碼
     * @param {string} data - 要列印的 QR 碼內容
     * @param {number} size - QR 碼大小（1~16）
     * @param {string} errorCorrection - 錯誤校正等級（L, M, Q, H）
     */
    printQRCode(data, size = 3, errorCorrection = 'L', cut = false) {
        this.openDevice((printer) => {
            let commands = [];

            // 选择二维码模型（模型 2）
            commands.push(...[0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]);

            // 设置二维码大小（1~16，默認為 3）
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size]);

            // 设置二维码的错误校正等级（L, M, Q, H）
            const errorCorrectionMap = { 'L': 0x30, 'M': 0x31, 'Q': 0x32, 'H': 0x33 };
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, errorCorrectionMap[errorCorrection] || 0x30]);

            // 存储要编码的数据
            let dataBytes = Buffer.from(data);
            let pL = dataBytes.length % 256;
            let pH = Math.floor(dataBytes.length / 256);
            commands.push(...[0x1D, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30], ...dataBytes);

            // 打印二维码
            commands.push(...[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]);
            commands.push(0x0A);

            console.log('發送的 QR 碼命令:', commands);
            printer.raw(Buffer.from(commands));

            // 切紙並關閉設備
            if (cut)
                printer.cut();
            printer.close();
            console.log('QR 碼打印完成');
        });
    }

    /**
     * 列印兩個並排的 QR 碼，確保排版正確
     * @param {string} leftQRData - 左側 QR 碼內容
     * @param {string} rightQRData - 右側 QR 碼內容
     * @param {number} size - QR 碼大小（1~16）
     */
    printDualQRCode(leftQRData, rightQRData, size = 5, cut = false) {
        this.openDevice((printer) => {
            printer.align('lt'); // 左對齊
            printer.qrimage(leftQRData, { type: 'png', size }, (err) => {
                if (err) {
                    console.error('打印左側 QR 碼失敗:', err);
                    return;
                }

                printer.text(' '.repeat(4)); // 增加間距，確保不重疊

                printer.align('rt'); // 右對齊
                printer.qrimage(rightQRData, { type: 'png', size }, (err) => {
                    if (err) {
                        console.error('打印右側 QR 碼失敗:', err);
                        return;
                    }

                    printer.feed(2); // 增加空行
                    if (cut)
                        printer.cut();
                    printer.close();
                    console.log('QR 碼打印完成');
                });
            });
        });
    }

    /**
     * 列印單個 QR 碼
     * @param {string} data - QR 碼內容
     * @param {number} size - QR 碼大小（1~16）
     * @param {boolean} cut - 是否切紙
     */
    async printQRCode(data, size = 5, cut = false) {
        const qrImage = await QRCodeGenerator.createQRCode(data, size);
        const outputPath = 'qr_output.png';
        await qrImage.writeAsync(outputPath);

        this.openDevice((printer) => {
            escpos.Image.load(outputPath, function (err, image) {
                if (err) {
                    console.error('載入 QR 碼圖片失敗:', err);
                    return;
                }
                printer.raster(image);
                if (cut) printer.cut();
                printer.close();
                console.log('QR 碼打印完成');
            });
        });
    }

    /**
     * 列印兩個並排的 QR 碼
     * @param {string} leftQRData - 左側 QR 碼內容
     * @param {string} rightQRData - 右側 QR 碼內容
     * @param {number} size - QR 碼大小（1~16）
     * @param {boolean} cut - 是否切紙
     */
    async printDualQRCode(leftQRData, rightQRData, size = 5, cut = false) {
        const [qr1, qr2] = await Promise.all([
            QRCodeGenerator.createQRCode(leftQRData, size),
            QRCodeGenerator.createQRCode(rightQRData, size)
        ]);

        const mergedImage = await QRCodeGenerator.mergeQRCodes(qr1, qr2);
        const outputPath = 'merged_qr_output.png';
        await mergedImage.writeAsync(outputPath);

        this.openDevice((printer) => {
            escpos.Image.load(outputPath, function (err, image) {
                if (err) {
                    console.error('載入合併 QR 碼圖片失敗:', err);
                    return;
                }
                printer.raster(image);
                if (cut) printer.cut();
                printer.close();
                console.log('雙 QR 碼打印完成');
            });
        });
    }
}

module.exports = QRCodePrinter;
