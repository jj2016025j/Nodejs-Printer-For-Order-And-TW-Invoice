const DateUtils = require('../utils/DateUtils');

console.log(DateUtils.formatDateTime()); 
// 輸出示例: 2024-02-10 14:30:45

const customDate = new Date('2023-12-25T10:15:30');
console.log(DateUtils.formatDateTime(customDate));
// 輸出: 2023-12-25 10:15:30

console.log(DateUtils.formatInvoiceDate('2024-02-09 23:59:59'));
// 輸出: 2024-02-10
