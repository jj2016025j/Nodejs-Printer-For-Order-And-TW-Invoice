const PrinterHandler = require('../core/PrinterHandler');
const QRCodeUtils = require('../utils/QRCodeUtils');
const InvoiceUtils = require('../utils/InvoiceUtils');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

class InvoicePrinter extends PrinterHandler {
  /**
   * 列印發票
   * @param {Object} invoiceData - 發票資料
   */
  async printInvoice(invoiceData) {
    try {
      // 產生 QR Code
      const barcodeContent = `${invoiceData.invoicePeriod}${invoiceData.invoiceNumber}${invoiceData.randomCode}`;

      await this.openDevice(async (printer) => {
        try {
          printer
            .font(`a`)
            .align(`lt`)
            .size(1, 1)
            .text(`    ${invoiceData.header}`)
            .style(`b`)// 加粗
            .size(1, 1)
            .text(`電子發票證明聯`)
            .size(1, 1)
            .text(` ${InvoiceUtils.convertInvoicePeriod(invoiceData.invoicePeriod)}`)
            .text(` ${invoiceData.invoiceNumber}`)
            .style(`NORMAL`)
            .size(0, 0)
            .text(`     ${invoiceData.dateTime}`)
            .text(InvoiceUtils.fillSpaces(`隨機碼:${invoiceData.randomCode}`, `總計${invoiceData.totalAmount}`, 22))
            .text(InvoiceUtils.fillSpaces(`賣方:${invoiceData.sellerId}`, `買方:${invoiceData.buyerId}`, 22))

            .barcode(barcodeContent, `CODE39`, {
              width: 30,
              height: 50, // 單位mm
              includeParity: false //EAN13/EAN8 bar code
            })

          // 這裡補一個列印qrcode圖片的方法 可以參考 InvoiceUtils 跟 QRCodePrinter 跟 QRCodeUtils
          await this.printQRCodeImage(invoiceData);
          // 電腦快一點的可以減少到50或更低
          await new Promise(resolve => setTimeout(resolve, 100));

          printer
            .cut()
            .font(`a`)
            .align(`lt`)
            .size(0, 0)
            .text(`公司: ${invoiceData.companyInfo}`)
            .style(`NORMAL`)
            .text(`發票編號: ${invoiceData.invoiceNumber}`)
            .text(`開票日期: ${InvoiceUtils.formatInvoiceDate(invoiceData.dateTime)}`)
            .text(`統一編號: ${invoiceData.buyerId}`)
            .text(`地址: ${invoiceData.address}`)
            .text(`電話: ${invoiceData.phone}`)
            .feed(1)
            .text(`商品: `)

          // **逐行列印商品明細**
          this.printInvoiceItems(printer, invoiceData.products);

          printer
            .feed(2)
            .text(`商品總額: ${invoiceData.subTotal}`)
            .text(`加值稅(10%): ${invoiceData.tax}`)
            .text(`總計: ${invoiceData.total}`)
            .feed(2)
            .flush()
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

  async printQRCodeImage(invoiceData) {
    try {
      // 產生 QR Code 內容
      const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;
      const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;

      // 產生合併 QR Code 圖片
      const outputPath = await QRCodeUtils.generateMergedQRCodes(leftQRContent, rightQRContent);
      console.log('QR Code 產生完成，路徑:', outputPath);

      this.openDevice(async (printer) => {
        try {
          // 列印 QR Code 圖片
          await this.printImage(outputPath);
          console.log('✅ QR Code 圖片列印完成');
        } catch (error) {
          console.error('❌ QR Code 圖片列印失敗:', error);
        }
      });
    } catch (error) {
      console.error('❌ 產生 QR Code 失敗:', error);
    }
  }

  /**
   * 逐行列印商品明細
   * @param {Object} printer - 印表機物件
   * @param {Array} products - 商品列表
   */
  printInvoiceItems(printer, products) {
    try {
      printer.text(`名稱      數量  單價  總金額`);

      products.forEach((product) => {
        const name = InvoiceUtils.calculatePadding(product.name, 12);
        const quantity = InvoiceUtils.calculatePadding(product.quantity.toString(), 4);
        const unitPrice = InvoiceUtils.calculatePadding(product.unitPrice.toString(), 8);
        const totalPrice = product.totalPrice.toString();

        printer.text(`${name}${quantity}${unitPrice}${totalPrice}`);
      });

      printer.feed(1);
    } catch (error) {
      console.error("❌ 商品明細列印失敗:", error);
    }
  }
}

module.exports = InvoicePrinter;
