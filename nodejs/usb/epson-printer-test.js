const epson = require('epson-printer');

const printer = new epson.Printer('USB001');

const invoice = {
  "invNum": "AA12345678",
  "invDate": "2023-07-20",
  "sellerName": "商店名稱",
  "sellerId": "123456789",
  "buyerName": "買家姓名",
  "buyerId": "987654321",
  "items": [
    {
      "name": "商品名稱",
      "quantity": 1,
      "unitPrice": 100,
      "amount": 100
    }
  ],
  "totalAmount": 100,
  "taxAmount": 5,
  "netAmount": 95
};

printer.printInvoice(invoice);
