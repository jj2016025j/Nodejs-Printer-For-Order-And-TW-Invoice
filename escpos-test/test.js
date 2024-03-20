

// 定義一個函數來格式化日期時間
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 使用自定義函數格式化當前時間
const formattedDateTime = formatDateTime(new Date());

// 將格式化後的時間輸出到控制台
console.log(formattedDateTime);




function convertInvoicePeriod(invoicePeriod) {
  // 解析年份和期別
  const year = parseInt(invoicePeriod.substring(0, 3));
  const period = parseInt(invoicePeriod.substring(3));

  const startMonth = period - 1;
  const endMonth = startMonth + 1;

  // 格式化輸出
  return `${year}年${startMonth.toString().padStart(2, '0')}-${endMonth.toString().padStart(2, '0')}月`;
}

// 使用範例
const invoicePeriod = '10404';
console.log(convertInvoicePeriod(invoicePeriod)); // 這會輸出：103年07-08月

// 商品信息数组
const items = [
  { name: 'LED顯示器', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
  { name: '無線鍵盤', quantity: 2, unitPrice: 700, totalPrice: 1400 }
];

// 改进的格式化为文本输出的函数，尝试完全对齐文本
function formatInvoiceItems(items) {
  let output = '名稱      數量  單價  總金額\n';

  // 计算填充长度
  const calculatePadding = (text, targetWidth) => {
    const chineseCharCount = text.replace(/[\x00-\xff]/g, "").length;
    const otherCharCount = text.length - chineseCharCount;
    const totalLength = chineseCharCount * 2 + otherCharCount;
    return text.padEnd(targetWidth + (text.length - totalLength), ' ');
  };

  items.forEach(item => {
    // 名称字段假定目标宽度为12（考虑到中文字符宽度），以此类推调整对齐
    const name = calculatePadding(item.name, 12);
    const quantity = calculatePadding(item.quantity.toString(), 4);
    const unitPrice = calculatePadding(item.unitPrice.toString(), 8);
    const totalPrice = item.totalPrice.toString();
    output += `${name}${quantity}${unitPrice}${totalPrice}\n`;
  });
  return output;
}

// 使用函数格式化商品信息并打印
const formattedText = formatInvoiceItems(items);
console.log(formattedText);

function formatInvoiceDate(dateTime) {
  // 解析日期時間字符串為Date物件
  const date = new Date(dateTime);

  // 增加一天
  date.setDate(date.getDate() + 1);

  // 格式化輸出
  // 注意：getMonth() 從 0 開始，所以需要加1來獲得正確的月份
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  return formattedDate;
}

// 使用範例
const dateTime = '2024-03-18 11:22:33';
console.log(formatInvoiceDate(dateTime));