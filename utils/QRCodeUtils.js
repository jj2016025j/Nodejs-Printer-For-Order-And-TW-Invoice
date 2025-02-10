const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

class QRCodeUtils {
    static async createQRCode(text, size = 4) {
        const qrStream = qr.image(text, { type: 'png', size });
        return new Promise((resolve, reject) => {
            streamToBuffer(qrStream, (err, buffer) => {
                if (err) reject(err);
                else Jimp.read(buffer).then(image => resolve(image)).catch(reject);
            });
        });
    }

    static async generateSingleQRCode(url) {
        const qrImage = await QRCodeUtils.createQRCode(url);
        const outputPath = 'src/single_qr.png';
        await qrImage.writeAsync(outputPath);
        return outputPath;
    }

    static async mergeQRCodes(qr1, qr2) {
        const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
        mergedImage.blit(qr1, 0, 0);
        mergedImage.blit(qr2, qr1.bitmap.width, 0);
        return mergedImage;
    }

    static async generateMergedQRCodes(leftQRContent, rightQRContent) {
        // 設定統一 QR Code 大小 (台灣發票 QR Code 大小約 144x144 px)
        const qrSize = 180;

        // 產生並調整 QR Code 大小
        const qr1 = await QRCodeUtils.createQRCode(leftQRContent, 4);
        const qr2 = await QRCodeUtils.createQRCode(rightQRContent, 4);
        await qr1.resize(qrSize, qrSize);
        await qr2.resize(qrSize, qrSize);
        await qr1.writeAsync('src/qr1.png');
        await qr2.writeAsync('src/qr2.png');
        const mergedImage = await QRCodeUtils.mergeQRCodes(qr1, qr2);
        const outputPath = 'src/double_qr.png';
        await mergedImage.writeAsync(outputPath);
        return outputPath;
    }
}

module.exports = QRCodeUtils;
