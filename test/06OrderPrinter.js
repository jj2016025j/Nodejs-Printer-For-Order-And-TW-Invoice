const OrderPrinter = require('../OrderPrinter');

const printer = new OrderPrinter();

// 測試列印 QR 碼訂單
printer.printOrderWithQR(
  "https://lee871116.ddns.net/A78146133",
  "12",
  "H123456789",
  ["本店酌收清潔費10%", "手機掃碼 立即點餐", "Real Life 實感生活", "祝您用餐愉快"],
  10
);

const OrderPrinter = require('../OrderPrinter');

// 訂單測試數據
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

// 測試：純訂單列印
printer.printOrder(orderData);

// 測試：訂單+QR 碼列印
printer.printOrder(orderData, "https://lee871116.ddns.net/A78146133", 10);