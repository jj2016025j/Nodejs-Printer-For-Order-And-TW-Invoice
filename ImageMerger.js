const Jimp = require('jimp');

class ImageMerger {
  /**
   * 合併兩個 QR 碼圖片
   * @param {Jimp} qr1 - 第一個 QR 碼圖片
   * @param {Jimp} qr2 - 第二個 QR 碼圖片
   * @returns {Promise<Jimp>} - 合併後的圖片
   */
  static async mergeQRCodes(qr1, qr2) {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
  }
}

module.exports = ImageMerger;
