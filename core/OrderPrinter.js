const PrinterHandler = require('./PrinterHandler');

class OrderPrinter extends PrinterHandler {
  /**
   * 列印訂單 (支援 QR 碼)
   * @param {Object} order - 訂單資訊
   * @param {string} [qrUrl] - 可選，QR 碼連結
   * @param {number} [qrSize=10] - QR 碼大小
   * @param {boolean} [cut=false] - 是否切紙
   */
  printOrder(order, qrUrl = null, qrSize = 10, cut = false) {
    this.openDevice((printer) => {
      console.log('正在列印訂單...');

      printer
        .font('a')
        .align('ct')
        .size(1, 1)
        .text("FangFood 芳鍋")
        .size(0, 0)
        .text('------------------------')
        .text(`訂單編號: ${order.orderNumber}`)
        .align('lt')
        .text(`下單日期: ${order.orderDate}`)
        .text(`地址: ${order.address}`)
        .text(`電話: ${order.phone}`)
        .align('ct')
        .text('------------------------')
        .align('lt')
        .text('菜單:')
        .size(1, 1)
        .text("名稱  單價 數量 總金額")
        .feed(1);

      order.items.forEach(item => {
        printer.text(`${item.name}  ${item.price}  ${item.quantity}  ${item.price * item.quantity}`);
      });

      printer
        .size(0, 0)
        .align('ct')
        .text('------------------------')
        .align('lt')
        .text(`餐點總額: ${order.total}`)
        .text(`服務費(${order.serviceChargeRate}%): ${order.serviceCharge}`)
        .text(`總計: ${order.total + order.serviceCharge}`)
        .text(`支付方式: ${order.paymentMethod}`)
        .align('ct')
        .text('------------------------')
        .align('lt')
        .text(`特殊要求: ${order.specialRequests}`)
        .feed(1);

      if (qrUrl) {
        printer.align('ct').qrimage(qrUrl, { type: 'png', size: qrSize }, function (err) {
          if (err) {
            console.error('QR 碼列印失敗:', err);
            return;
          }
          console.log('✅ QR 碼列印完成');
        });
      }

      printer.feed(2);

      if (cut) printer.cut();
      printer.close();

      console.log(`✅ 訂單 ${order.orderNumber} 列印完成`);
    });
  }

  /**
   * 列印訂單與 QR 碼
   * @param {string} url - 訂單 QR 碼連結
   * @param {string} tableNumber - 桌號
   * @param {string} orderNumber - 訂單編號
   * @param {Array<string>} contents - 額外訊息 (例如公告、優惠等)
   * @param {number} size - QR 碼大小
   * @param {boolean} cut - 是否切紙
   */
  printOrderWithQR(url, tableNumber, orderNumber, contents, size = 10, cut = false) {
    this.openDevice((printer) => {
      console.log('正在列印訂單與 QR 碼...');

      printer
        .font('a')
        .align('ct')
        .size(1, 1)
        .text('Real Life 實感生活')
        .feed(1)
        // .align('lt')
        .size(0, 0)
        .text(`桌號: ${tableNumber}`)
        .text(`訂單編號: ${orderNumber}`)
        .text(`時間: ${Utils.formatDateTime()}`)
        .text('---------------------------')
        .qrimage(url, { type: 'png', size }, function (err) {
          if (err) {
            console.error('QR 碼列印失敗:', err);
            return;
          }

          this.feed(1);
          contents.forEach(content => this.text(content));
          this.feed(2);

          if (cut) this.cut();
          this.close();

          console.log(`✅ 訂單 ${orderNumber} QR 碼列印完成`);
        });
    });
  }
}

module.exports = OrderPrinter;
