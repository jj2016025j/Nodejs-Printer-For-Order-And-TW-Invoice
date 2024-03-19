// 純訂單 完成基本
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

function printOrder(printer, order) {
    device.open(function (error) {
        if (error) {
            console.error('打印機連接錯誤:', error);
            return;
        }
        console.log('打印機連接成功');
        printer
            .font('a')
            .align('ct')
            .size(1, 1)
            .text("FangFood 芳鍋")
            .size(0, 0)
            .text('------------------------')

            .text('訂單編號: ' + order.orderNumber)
            .align('lt')
            .text('下單日期: ' + order.orderDate)
            .text('地址: ' + order.address)
            .text('電話: ' + order.phone)
            .align('ct')
            .text('------------------------')
            .align('lt')
            .text('菜單:')
            .size(1, 1)
            .text("名稱  單價 數量 總金額")
            .feed(1)

        order.items.forEach(item => {
            printer
                .text(`${item.name}  ${item.price}  ${item.quantity}  ${item.price * item.quantity}`)
                .feed(1)
        });

        printer
            .size(0, 0)
            .align('ct')
            .text('------------------------')
            .align('lt')
            .text('餐點總額: ' + order.total)
            .text('服務費(' + order.serviceChargeRate + '%): ' + order.serviceCharge)
            .text('總計: ' + (order.total + order.serviceCharge))
            .text('支付方式: ' + order.paymentMethod)
            .align('ct')
            .text('------------------------')
            .align('lt')
            .text('特殊要求: ' + order.specialRequests)
            .feed(2)
            .cut()
            .close()
        console.log('打印完成');
    });
}

const orderData = {
    orderNumber: 'H123456789',
    orderDate: '2024-03-19',
    address: '台北市大安區忠孝東路100號',
    phone: '02-9876-5432',
    items: [
        { name: '牛肉片', price: 300, quantity: 1 },
        { name: '羊肉片', price: 350, quantity: 2 },
        { name: '高麗菜', price: 100, quantity: 1 },
        { name: '手工丸子', price: 150, quantity: 1 }
    ],
    total: 1250,
    serviceChargeRate: 10,
    serviceCharge: 125,
    paymentMethod: '信用卡',
    specialRequests: '牛肉片請分開盛裝。'
};

printOrder(printer, orderData); // 调用打印函数