const PrinterHandler = require('./PrinterHandler');

class OrderPrinter extends PrinterHandler {
  printOrder(order) {
    this.openDevice((printer) => {
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
        printer.text(`${item.name}  ${item.price}  ${item.quantity}  ${item.price * item.quantity}`).feed(1);
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
        .feed(2)
        .cut()
        .close();

      console.log('訂單打印完成');
    });
  }
}

module.exports = OrderPrinter;
