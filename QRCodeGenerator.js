const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

class QRCodeGenerator {
  /**
   * 產生 QR 碼圖片
   * @param {string} text - QR 碼內容
   * @param {number} size - QR 碼大小
   * @returns {Promise<Jimp>}
   */
  static createQRCode(text, size) {
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

  /**
   * 合併兩個 QR 碼圖像
   * @param {Jimp} qr1 - 左側 QR 碼
   * @param {Jimp} qr2 - 右側 QR 碼
   * @returns {Promise<Jimp>}
   */
  static async mergeQRCodes(qr1, qr2) {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
  }
}

module.exports = QRCodeGenerator;
