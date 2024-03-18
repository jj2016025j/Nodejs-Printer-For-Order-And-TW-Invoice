// 引入Node.js的內建模組
const fs = require('fs');

// 假設的電子發票資料
const invoiceData = {
  invoiceNumber: 'AA12345678',
  date: '2024-03-01',
  seller: {
    name: 'XYZ Electronics',
    address: '123 Tech Road, Taipei',
    taxID: '12345678'
  },
  buyer: {
    name: 'John Doe',
    address: '456 Main Street, Taipei',
    taxID: '87654321'
  },
  items: [
    { description: 'Laptop', quantity: 1, unitPrice: 50000, amount: 50000 },
    { description: 'USB Cable', quantity: 2, unitPrice: 500, amount: 1000 }
  ],
  subtotal: 51000,
  tax: 2550,
  total: 53550
};

// 生成發票內容的函數
function generateInvoice(invoice) {
  const { invoiceNumber, date, seller, buyer, items, subtotal, tax, total } = invoice;
  
  // 建立發票的標題和基本資訊
  let invoiceContent = `發票號碼: ${invoiceNumber}\n日期: ${date}\n\n賣方資訊:\n${seller.name}\n${seller.address}\n稅籍編號: ${seller.taxID}\n\n買方資訊:\n${buyer.name}\n${buyer.address}\n稅籍編號: ${buyer.taxID}\n\n貨品或服務:\n`;

  // 加入每項商品或服務的資訊
  items.forEach(item => {
    invoiceContent += `${item.description} - 數量: ${item.quantity}, 單價: ${item.unitPrice}, 金額: ${item.amount}\n`;
  });

  // 加入小計、稅額和總計
  invoiceContent += `\n小計: ${subtotal}\n稅額: ${tax}\n總計: ${total}`;

  return invoiceContent;
}

// 打印發票內容到控制台
console.log(generateInvoice(invoiceData));

// 如需將發票內容保存到檔案，可以使用以下代碼
// fs.writeFile('invoice.txt', generateInvoice(invoiceData), (err) => {
//   if (err) throw err;
//   console.log('發票已保存到檔案。');
// });
