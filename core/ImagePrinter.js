const PrinterHandler = require('./PrinterHandler');
const QRCodeUtils = require('../utils/QRCodeUtils');
const PrintUtils = require('../utils/PrintUtils');
const escpos = require(`escpos`);

class ImagePrinter extends PrinterHandler {
    constructor() {
        super(); // 繼承 PrinterHandler 的初始化
    }

    /**
     * 列印 QR 碼圖片
     * @param {string} data - QR Code 內容
     * @param {number} size - QR Code 大小 (1~16)
     * @param {boolean} cut - 是否切紙
     */
    async printQRCode(data, size = 3, cut = false) {
        try {
            const qrImage = await QRCodeUtils.createQRCodeBuffer(data, size);
            this.openDevice(async (printer) => {
                await PrintUtils.printImage(printer, qrImage);
                if (cut) printer.cut();
                this.closeDevice();
                console.log(`✅ QR 碼打印成功: ${data}`);
            });
        } catch (error) {
            console.error(`❌ QR 碼列印失敗: ${error.message}`);
        }
    }

    /**
     * 列印合併雙 QR 碼圖片
     * @param {string} leftQRData - 左側 QR Code 內容
     * @param {string} rightQRData - 右側 QR Code 內容
     * @param {number} size - QR Code 大小 (1~16)
     * @param {number} spacing - QR Code 間距
     * @param {boolean} cut - 是否切紙
     */
    async printMergedQRCode(leftQRData, rightQRData, size = 3, spacing = 0, cut = false) {
        try {
            const mergedQR = await QRCodeUtils.generateMergedQRCode(leftQRData, rightQRData, size, spacing);
            this.openDevice(async (printer) => {
                await PrintUtils.printImage(printer, mergedQR);
                if (cut) printer.cut();
                this.closeDevice();
                console.log(`✅ 雙 QR 碼打印成功`);
            });
        } catch (error) {
            console.error(`❌ 雙 QR 碼列印失敗: ${error.message}`);
        }
    }

    /**
     * 列印圖片
     * @param {string} imagePath - 圖片檔案路徑
     * @param {boolean} cut - 是否切紙
     */
    async printImage(imagePath, cut = false) {
        try {
            this.openDevice(async (printer) => {
                escpos.Image.load(imagePath, function (image) {
                    printer
                        .raster(image)
                }
                )
                if (cut) printer.cut();
                this.closeDevice();
                console.log(`✅ 圖片打印成功: ${imagePath}`);
            });
        } catch (error) {
            console.error(`❌ 圖片列印失敗 (${imagePath}): ${error.message}`);
        }
    }
}

module.exports = ImagePrinter;
