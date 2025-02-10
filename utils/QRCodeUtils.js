const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

class QRCodeUtils {
  /**
   * 產生 QR 碼影像
   * @param {string} text - QR 碼內容
   * @param {number} size - QR 碼大小 (1~16)
   * @returns {Promise<Jimp>} - 產生的 QR 碼影像
   */
  static createQRCode(text, size = 3) {
    const qrStream = qr.image(text, { type: 'png', size });
    return new Promise((resolve, reject) => {
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
   * 合併兩個 QR 碼
   * @param {Jimp} qr1 - 左側 QR 碼
   * @param {Jimp} qr2 - 右側 QR 碼
   * @returns {Promise<Jimp>} - 合併後的 QR 碼
   */
  static async mergeQRCodes(qr1, qr2) {
    const mergedImage = new Jimp(
      qr1.bitmap.width + qr2.bitmap.width,
      Math.max(qr1.bitmap.height, qr2.bitmap.height)
    );
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
  }

  /**
   * 生成並合併左右 QR Code
   * @param {string} leftText - 左側 QR Code 內容
   * @param {string} rightText - 右側 QR Code 內容
   * @param {number} size - QR Code 大小 (1~16)
   * @returns {Promise<Jimp>} - 產生的合併 QR Code 影像
   */
  static async generateMergedQRCode(leftText, rightText, size = 3) {
    try {
      const leftQR = await this.createQRCode(leftText, size);
      const rightQR = await this.createQRCode(rightText, size);
      const mergedImage = await this.mergeQRCodes(leftQR, rightQR);
      const outputPath = 'merged_qr_output.png';
      await mergedImage.writeAsync(outputPath);
      return outputPath;
    } catch (error) {
      console.error('❌ 產生 QR Code 失敗:', error);
      throw error;
    }
  }
}

module.exports = QRCodeUtils;
