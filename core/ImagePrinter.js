const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const PrinterHandler = require('./PrinterHandler');
const QRCodeUtils = require('../utils/QRCodeUtils');
const Jimp = require('jimp');

class QRCodePrinter extends PrinterHandler {
    async printImage(imagePath) {
        return new Promise((resolve, reject) => {
            Jimp.read(imagePath)
                .then(image => {
                    const maxWidth = 384; // 設定最大寬度為 384 像素（適應大多數熱感應打印機）
                    if (image.bitmap.width > maxWidth) {
                        image = image.resize(maxWidth, Jimp.AUTO);
                    }
                    return image.greyscale().threshold({ max: 128 }).writeAsync(imagePath);
                })
                .then(() => {
                    escpos.Image.load(imagePath, (image) => {
                        this.printer.raster(image);
                        this.printer.flush(() => {
                            resolve();
                        });
                    });
                })
                .catch(reject);
        });
    }

    async printQRCode(content) {
        this.openDevice(async (printer) => {
            const outputPath = await QRCodeUtils.generateSingleQRCode(content).catch(console.error);
            console.log('outputPath', outputPath);
            await this.printImage(outputPath);
            this.closeDevice();
            console.log('打印完成');
        });
    }

    async printDoubleQRCode(leftQRContent, rightQRContent) {
        this.openDevice(async (printer) => {
            const outputPath = await QRCodeUtils.generateMergedQRCodes(leftQRContent, rightQRContent).catch(console.error);
            console.log('outputPath', outputPath);
            await this.printImage(outputPath);
            this.closeDevice();
            console.log('打印完成');
        });
    }

    async printCustomImage(imagePath) {
        this.openDevice(async (printer) => {
            console.log('📂 正在列印圖片:', imagePath);
            await this.printImage(imagePath).catch(console.error);
            this.closeDevice();
            console.log('📷 圖片列印完成');
        });
    }
}

module.exports = QRCodePrinter;
