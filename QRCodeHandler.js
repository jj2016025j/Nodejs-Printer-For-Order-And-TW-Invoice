const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

class QRCodeHandler {
  static async createQRCode(text, size) {
    return new Promise((resolve, reject) => {
      const qrStream = qr.image(text, { type: 'png', size });
      streamToBuffer(qrStream, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          Jimp.read(buffer).then(image => resolve(image)).catch(reject);
        }
      });
    });
  }

  static async mergeQRCodes(qr1, qr2) {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
  }

  static async generateMergedQRCode(url1, url2) {
    const qr1 = await this.createQRCode(url1, 5);
    const qr2 = await this.createQRCode(url2, 5);
    const mergedImage = await this.mergeQRCodes(qr1, qr2);
    const outputPath = 'output.png';
    await mergedImage.writeAsync(outputPath);
    return outputPath;
  }
}

module.exports = QRCodeHandler;
