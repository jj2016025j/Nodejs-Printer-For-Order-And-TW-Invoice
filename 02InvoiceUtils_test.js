const InvoiceUtils = require('./InvoiceUtils');

console.log(InvoiceUtils.convertInvoicePeriod("10404")); // ✅ 104年03-04月
console.log(InvoiceUtils.convertInvoicePeriod("10506")); // ✅ 105年11-12月
console.log(InvoiceUtils.convertInvoicePeriod("ABC01")); // ❌ 無效期別
console.log(InvoiceUtils.convertInvoicePeriod("10A03")); // ❌ 無效期別
console.log(InvoiceUtils.convertInvoicePeriod("123"));   // ❌ 格式錯誤

console.log(InvoiceUtils.formatInvoiceDate("2024-03-18 11:22:33")); // ✅ 2024-03-18
console.log(InvoiceUtils.formatInvoiceDate("Invalid Date"));        // ❌ 無效日期

console.log(InvoiceUtils.fillSpaces("左側", "右側", 20));  // ✅ "左側           右側"
console.log(InvoiceUtils.fillSpaces("長文本", "短", 10));  // ✅ "長文本  短"
console.log(InvoiceUtils.fillSpaces("超長文字", "超長右側", 5));  // ✅ "超長文字 超長右側"
