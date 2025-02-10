const PrinterHandler = require('../core/PrinterHandler');
const QRCodeUtils = require('../utils/QRCodeUtils');
const InvoiceUtils = require('../utils/InvoiceUtils');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
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

      this.openDevice(async (printer) => {
        try {
          // printer
          // .font('a')
          // .align('lt')
          // .size(1, 1)
          // .font(`a`)
          // .align(`lt`)
          // .size(1, 1)
          // .text(invoiceData.header)
          // .style(`b`)// 加粗
          // .size(1, 1)
          // .text(`電子發票證明聯`)
          // .size(1, 1)
          // .text(` ${InvoiceUtils.convertInvoicePeriod(invoiceData.invoicePeriod)}`)
          // .text(` ${invoiceData.invoiceNumber}`)
          // .style(`NORMAL`)
          // .size(0, 0)
          // .text(`     ${invoiceData.dateTime}`)
          // .text(InvoiceUtils.fillSpaces(`隨機碼:${invoiceData.randomCode}`, `總計${invoiceData.totalAmount}`, 22))
          // .text(InvoiceUtils.fillSpaces(`賣方:${invoiceData.sellerId}`, `買方:${invoiceData.buyerId}`, 22))

          // .barcode(barcodeContent, `CODE39`, {
          //   width: 30,
          //   height: 50, // 單位mm
          //   includeParity: false //EAN13/EAN8 bar code
          // })
          
          this.printDoubleQRCode(leftQRContent, rightQRContent)

          // printer
          //   .cut()
          //   .font(`a`)
          //   .align(`lt`)
          //   .size(0, 0)
          //   .text(`公司: ${invoiceData.companyInfo}`)
          //   .style(`NORMAL`)
          //   .text(`發票編號: ${invoiceData.invoiceNumber}`)
          //   .text(`開票日期: ${InvoiceUtils.formatInvoiceDate(invoiceData.dateTime)}`)
          //   .text(`統一編號: ${invoiceData.buyerId}`)
          //   .text(`地址: ${invoiceData.address}`)
          //   .text(`電話: ${invoiceData.phone}`)
          //   .feed(1)
          //   .text(`商品: `)

          // InvoiceUtils.formatInvoiceItems(invoiceData.products);

          printer
            // .feed(2)
            // .text(`商品總額: ${invoiceData.subTotal}`)
            // .text(`加值稅(10%): ${invoiceData.tax}`)
            // .text(`總計: ${invoiceData.total}`)
            // .feed(2)
            // .flush()
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
   * @returns {Promise<string>} - 產生的 QR Code 圖片路徑
   */
  async generateInvoiceQRCode(invoiceData) {
    const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;
    const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;

    return await QRCodeUtils.generateMergedQRCodes(leftQRContent, rightQRContent);
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

  async printImage(imagePath) {
    return new Promise((resolve, reject) => {
      escpos.Image.load(imagePath, (image) => {
        this.printer.raster(image);
        this.printer.flush(() => {
          resolve();
        });
      });
    });
  }
}

module.exports = InvoicePrinter;
