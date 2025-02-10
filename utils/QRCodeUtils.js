const Jimp = require('jimp');
const qr = require('qr-image');
const fs = require('fs').promises;

class QRCodeUtils {
  /**
   * 產生 QR 碼影像並回傳 Jimp 物件
   * @param {string} text - QR Code 內容
   * @param {number} size - QR Code 大小 (1~16)
   * @returns {Promise<Jimp>} - 產生的 QR Code 影像 (Jimp 物件)
   */
  static async createQRCodeBuffer(text, size = 3) {
    if (typeof text !== 'string' || text.trim() === '') {
      throw new Error('QR Code 內容不可為空');
    }
    if (typeof size !== 'number' || size < 1 || size > 16) {
      throw new Error('QR Code 大小必須在 1 到 16 之間');
    }
    try {
      const buffer = qr.imageSync(text, { type: 'png', size });
      return await Jimp.read(buffer);
    } catch (error) {
      console.error('❌ 產生 QR Code 失敗:', error);
      throw error;
    }
  }

  /**
   * 儲存 Jimp 影像至指定檔案
   * @param {Jimp} image - Jimp 物件
   * @param {string} outputPath - 儲存的檔案路徑
   * @returns {Promise<string>} - 儲存的檔案路徑
   */
  static async saveImage(image, outputPath) {
    if (!(image instanceof Jimp)) {
      throw new Error('提供的物件不是有效的 Jimp 影像');
    }
    try {
      await image.writeAsync(outputPath);
      return outputPath;
    } catch (error) {
      console.error(`❌ 儲存影像失敗: ${outputPath}`, error);
      throw error;
    }
  }

  /**
   * 合併兩個 QR 碼並回傳 Jimp 物件
   * @param {Jimp} qr1 - 左側 QR Code 影像
   * @param {Jimp} qr2 - 右側 QR Code 影像
   * @returns {Promise<Jimp>} - 合併後的 QR Code 影像
   */
  static async mergeQRCodes(qr1, qr2, spacing = 0) {
    if (!(qr1 instanceof Jimp) || !(qr2 instanceof Jimp)) {
      throw new Error('提供的 QR Code 不是有效的 Jimp 物件');
    }
    try {
      const width = qr1.bitmap.width + qr2.bitmap.width + spacing;
      const height = Math.max(qr1.bitmap.height, qr2.bitmap.height);
      const mergedImage = new Jimp(width, height, 0xffffffff); // 背景白色
      mergedImage.blit(qr1, 0, 0);
      mergedImage.blit(qr2, qr1.bitmap.width + spacing, 0);
      return mergedImage;
    } catch (error) {
      console.error('❌ 合併 QR Code 失敗:', error);
      throw error;
    }
  }

  /**
   * 產生 QR Code 並儲存檔案
   * @param {string} text - QR Code 內容
   * @param {number} size - QR Code 大小 (1~16)
   * @param {string} outputPath - 儲存 QR Code 的檔案路徑
   * @returns {Promise<string>} - 產生的 QR Code 檔案路徑
   */
  static async createQRCode(text, size = 3, outputPath = 'qrcode.png') {
    const qrImage = await this.createQRCodeBuffer(text, size);
    return outputPath;
  }

  /**
   * 生成並合併左右 QR Code 並儲存檔案
   * @param {string} leftText - 左側 QR Code 內容
   * @param {string} rightText - 右側 QR Code 內容
   * @param {number} size - QR Code 大小 (1~16)
   * @param {string} outputPath - 儲存合併 QR Code 的檔案路徑
   * @returns {Promise<string>} - 產生的合併 QR Code 圖片路徑
   */
  static async generateMergedQRCode(leftText, rightText, size = 3, outputPath = 'merged_qr_output.png') {
    try {
      const [leftQR, rightQR] = await Promise.all([
        this.createQRCodeBuffer(leftText, size),
        this.createQRCodeBuffer(rightText, size)
      ]);
      const mergedImage = await this.mergeQRCodes(leftQR, rightQR);
      return this.saveImage(mergedImage, outputPath);
    } catch (error) {
      console.error('❌ 產生合併 QR Code 失敗:', error);
      throw error;
    }
  }
}

module.exports = QRCodeUtils;
