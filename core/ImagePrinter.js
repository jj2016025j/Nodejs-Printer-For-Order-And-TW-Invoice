// ImagePrinter.js
const PrinterHandler = require('./PrinterHandler');
const QRCodeUtils = require('../utils/QRCodeUtils');
const escpos = require('escpos');

class ImagePrinter extends PrinterHandler {
    /**
     * 列印 QR 碼圖片
     */
    async printQRCodeImage(data, size = 5, cut = false) {
        const qrImage = await QRCodeUtils.createQRCode(data, size);
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
     * 列印合併雙 QR 碼圖片
     */
    async printMergedQRCodeImage(leftQRData, rightQRData, size = 5, cut = false) {
        const [qr1, qr2] = await Promise.all([
            QRCodeUtils.createQRCode(leftQRData, size),
            QRCodeUtils.createQRCode(rightQRData, size)
        ]);
        const mergedImage = await QRCodeUtils.mergeQRCodes(qr1, qr2);
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

module.exports = ImagePrinter;