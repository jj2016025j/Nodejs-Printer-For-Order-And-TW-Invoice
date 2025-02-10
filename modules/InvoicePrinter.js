const PrinterHandler = require('../core/PrinterHandler');
const QRCodeUtils = require('../utils/QRCodeUtils');
const InvoiceUtils = require('../utils/InvoiceUtils');
const escpos = require('escpos');
const Jimp = require('jimp');

class InvoicePrinter extends PrinterHandler {
  /**
   * 列印發票
   * @param {Object} invoiceData - 發票資料
   */
  async printInvoice(invoiceData) {
    try {
      // 產生 QR Code
      const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;
      const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;
      const barcodeContent = `${invoiceData.invoicePeriod}${invoiceData.invoiceNumber}${invoiceData.randomCode}`;

      const outputPath = await QRCodeUtils.generateMergedQRCode(leftQRContent, rightQRContent);

      this.openDevice((printer) => {
        try {
          const invoiceText = this.generateInvoiceText(invoiceData);

          printer
            .font('a')
            .align('lt')
            .size(1, 1)
            .text(invoiceText)
            .barcode(barcodeContent, 'CODE39', { width: 1, height: 50 });

          if (outputPath) {
            printer.raster(outputPath);
          }

          printer
            .text(`公司: ${invoiceData.companyInfo}`)
            .text(`發票編號: ${invoiceData.invoiceNumber}`)
            .text(`地址: ${invoiceData.address}`)
            .text(`電話: ${invoiceData.phone}`)
            .feed(1)

            .text('商品: ');

          InvoiceUtils.printInvoiceItems(this.printer, invoiceData.items);

          this.printer.feed(2)
            .text(`商品總額: ${invoiceData.subTotal}`)
            .text(`加值稅(10%): ${invoiceData.tax}`)
            .text(`總計: ${invoiceData.total}`)
            .feed(2)
            .close();

          console.log('✅ 發票打印完成');
        } catch (error) {
          console.error('❌ 發票列印錯誤:', error);
        }
      });
    } catch (error) {
      console.error('❌ QR Code 產生失敗:', error);
    }
  }

  /**
   * 產生發票的 QR Code
   * @param {Object} invoiceData
   * @returns {Promise<Jimp>} - 產生的 QR Code 影像
   */
  async generateInvoiceQRCode(invoiceData) {
    const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;
    const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;

    return await QRCodeUtils.generateMergedQRCode(leftQRContent, rightQRContent);
  }

  /**
   * 產生發票文字內容
   * @param {Object} invoiceData
   * @returns {string} - 發票內容
   */
  generateInvoiceText(invoiceData) {
    return [
      invoiceData.header,
      '電子發票證明聯',
      ` ${InvoiceUtils.convertInvoicePeriod(invoiceData.invoicePeriod)}`,
      ` ${invoiceData.invoiceNumber}`,
      `     ${invoiceData.dateTime}`,
      InvoiceUtils.fillSpaces(`隨機碼:${invoiceData.randomCode}`, `總計${invoiceData.totalAmount}`, 32),
      InvoiceUtils.fillSpaces(`賣方:${invoiceData.sellerId}`, `買方:${invoiceData.buyerId}`, 32),
    ].join('\n');
  }

  /**
   * 轉換 Jimp 圖片為 escpos.Image
   * @param {Jimp} jimpImage
   * @returns {Promise<escpos.Image>}
   */
  async convertToEscposImage(jimpImage) {
    return new Promise((resolve, reject) => {
      jimpImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
          console.error("❌ 轉換 Jimp 影像失敗:", err);
          return reject(err);
        }

        escpos.Image.load(buffer, (err, escposImage) => {
          if (err) {
            console.error("❌ 轉換 escpos.Image 失敗:", err);
            return reject(err);
          }
          resolve(escposImage);
        });
      });
    });
  }
}

module.exports = InvoicePrinter;
