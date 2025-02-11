const InvoicePrinter = require('../modules/InvoicePrinter');

const invoiceData = {
  header: '實感生活',
  dateTime: '2024-03-18 11:22:33', // 確保符合 YYYY-MM-DD HH:mm:ss 格式
  invoicePeriod: '10404',
  invoiceNumber: 'AB-12345678',
  randomCode: '1234',
  totalAmount: 100, // 轉為數字格式
  subTotal: 90, // 商品總額
  tax: 10, // 10% VAT
  sellerId: '53589318',
  buyerId: '79461349',
  companyInfo: '實感生活有限公司',
  address: '台北市信義區市府路1號',
  phone: '02-1234-5678',
  salesAmount: '00002710',
  encryptionInfo: 'encryptedStringHere',
  selfUseArea: '**********',
  itemCount: 2, // 轉為數字
  encoding: '1',
  products: [
    { name: 'LED顯示器', quantity: 1, unitPrice: 500, totalPrice: 500 },
    { name: '無線鍵盤', quantity: 2, unitPrice: 750, totalPrice: 1500 }
  ],
};

const printer = new InvoicePrinter();
printer.printInvoice(invoiceData);
