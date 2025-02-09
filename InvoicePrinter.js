const PrinterHandler = require('./PrinterHandler');
const QRCodeHandler = require('./QRCodeHandler');
const InvoiceUtils = require('./InvoiceUtils');

class InvoicePrinter extends PrinterHandler {
  async printInvoice(invoiceData) {
    const leftQRContent = `${invoiceData.invoiceNumber}:${invoiceData.date}:${invoiceData.randomCode}:${invoiceData.salesAmount}:${invoiceData.totalAmount}:${invoiceData.buyerId}:${invoiceData.sellerId}:${invoiceData.encryptionInfo}`;
    const rightQRContent = `**:${invoiceData.selfUseArea}:${invoiceData.itemCount}:${invoiceData.itemCount}:${invoiceData.encoding}:${invoiceData.products}`;

    const outputPath = await QRCodeHandler.generateMergedQRCode(leftQRContent, rightQRContent);

    this.openDevice((printer) => {
      printer
        .font('a')
        .align('lt')
        .size(1, 1)
        .text(invoiceData.header)
        .style('b')
        .text('電子發票證明聯')
        .text(` ${InvoiceUtils.convertInvoicePeriod(invoiceData.invoicePeriod)}`)
        .text(` ${invoiceData.invoiceNumber}`)
        .style('NORMAL')
        .text(`     ${invoiceData.dateTime}`)
        .text(InvoiceUtils.fillSpaces(`隨機碼:${invoiceData.randomCode}`, `總計${invoiceData.totalAmount}`, 22))
        .text(InvoiceUtils.fillSpaces(`賣方:${invoiceData.sellerId}`, `買方:${invoiceData.buyerId}`, 22))
        .barcode(invoiceData.invoiceNumber, 'CODE39', { width: 1, height: 50 })
        .raster(outputPath)
        .text(`公司: ${invoiceData.companyInfo}`)
        .text(`地址: ${invoiceData.address}`)
        .text(`電話: ${invoiceData.phone}`)
        .feed(1)
        .cut()
        .close();

      console.log('發票打印完成');
    });
  }
}

module.exports = InvoicePrinter;
