const InvoiceUtils = require('../utils/InvoiceUtils');

console.log(InvoiceUtils.convertInvoicePeriod('10404')); 
// 輸出: 104年03-04月

console.log(InvoiceUtils.validateInvoicePeriod('10404')); 
// 輸出: true

console.log(InvoiceUtils.validateInvoicePeriod('ABC12')); 
// 輸出: false

console.log(InvoiceUtils.formatInvoiceDate('2024-03-18 11:22:33'));
// 輸出: 2024-03-18

console.log(InvoiceUtils.fillSpaces('賣方: 12345678', '買方: 87654321', 30));
// 輸出: "賣方: 12345678        買方: 87654321"

const items = [
    { name: 'LED顯示器', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
    { name: '無線鍵盤', quantity: 2, unitPrice: 700, totalPrice: 1400 }
];

console.log(InvoiceUtils.formatInvoiceItems(items));

console.log(InvoiceUtils.calculatePadding('LED顯示器', 12));
// 輸出: "LED顯示器   "  (補足到 12 個字元)
