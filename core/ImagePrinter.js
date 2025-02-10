const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const QRCodeUtils = require('../utils/QRCodeUtils');
const PrinterHandler = require('./PrinterHandler');

class ImagePrinter extends PrinterHandler {
  /**
   * 產生並列印合併的 QR Code 圖片
   * @param {string} leftQRContent - 左側 QR Code 內容
   * @param {string} rightQRContent - 右側 QR Code 內容
   */
  async printMergedQRCodes(leftQRContent, rightQRContent) {
    try {
      const outputPath = await QRCodeUtils.generateMergedQRCode(leftQRContent, rightQRContent);
      this.printImage(outputPath);
    } catch (error) {
      console.error('❌ 列印合併 QR Code 失敗:', error);
    }
  }

  /**
   * 產生並列印單個 QR Code
   * @param {string} qrContent - QR Code 內容
   */
  async printQRCode(qrContent) {
    try {
      const outputPath = await QRCodeUtils.createQRCode(qrContent);
      this.printImage(outputPath);
    } catch (error) {
      console.error('❌ 列印 QR Code 失敗:', error);
    }
  }

  /**
   * 列印圖片
   * @param {string} imagePath - 圖片路徑
   */
  printImage(imagePath) {
    console.log("imagePath", imagePath)
    this.openDevice((printer) => {
      // console.log("printer", printer)
      escpos.Image.load(imagePath, (image) => {
        printer.raster(image).feed(2).close();
        console.log('✅ 圖片列印完成');
      });
    });
  }
}

module.exports = ImagePrinter;