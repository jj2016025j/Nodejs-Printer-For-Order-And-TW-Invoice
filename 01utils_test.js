const DateUtils = require('./dateUtils');
const InvoiceUtils = require('./InvoiceUtils');
const TextUtils = require('./textUtils');

// 取得當前時間
const formattedDateTime = DateUtils.formatDateTime(new Date());
console.log(`格式化時間: ${formattedDateTime}`);

// 轉換發票期別
const invoicePeriod = '10404';
console.log(`發票期別轉換: ${InvoiceUtils.convertInvoicePeriod(invoicePeriod)}`);

// 格式化商品資訊
const items = [
  { name: 'LED顯示器', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
  { name: '無線鍵盤', quantity: 2, unitPrice: 700, totalPrice: 1400 }
];
console.log('商品資訊:\n' + TextUtils.formatInvoiceItems(items));

// 解析發票日期並加一天
const dateTime = '2024-03-18 11:22:33';
console.log(`發票日期加一天: ${DateUtils.formatInvoiceDate(dateTime)}`);
