const InvoicePrinter = require('../InvoicePrinter');

const invoiceData = {
  header: 'FangFood 芳鍋',
  dateTime: '2024-03-18 11:22:33',
  invoicePeriod: '10404',
  invoiceNumber: 'AB-12345678',
  randomCode: '1234',
  totalAmount: '100',
  sellerId: '53589318',
  buyerId: '79461349',
  companyInfo: '芳鍋企業有限公司',
  address: '台北市信義區市府路1號',
  phone: '02-1234-5678',
  salesAmount: '00002710',
  encryptionInfo: 'encryptedStringHere',
  selfUseArea: '**********',
  itemCount: '5',
  encoding: '1',
  products: 'LED顯示器:1:500:無;無線鍵盤:2:750:無',
};

const printer = new InvoicePrinter();
printer.printInvoice(invoiceData);
