const InvoicePrinter = require('../core/InvoicePrinter');
const InvoiceUtils = require('../utils/InvoiceUtils');
const fs = require('fs');

const printer = new InvoicePrinter();

console.log("\n🚀 開始測試 InvoicePrinter...\n");

// 測試發票資料
const mockInvoiceData = {
  invoiceNumber: "AB12345678",
  date: "2024-02-10",
  dateTime: "2024-02-10 14:30:00",
  randomCode: "5678",
  salesAmount: "1000",
  totalAmount: "1200",
  buyerId: "B123456789",
  sellerId: "S987654321",
  encryptionInfo: "ENCRYPT12345",
  selfUseArea: "XX",
  itemCount: "3",
  encoding: "UTF-8",
  products: "商品A,商品B,商品C",
  companyInfo: "測試公司",
  address: "台北市測試路100號",
  phone: "02-1234-5678",
  invoicePeriod: "11301",
  header: "==== 測試發票 ===="
};

// **🟢 測試 1: 發票文字產生**
function testGenerateInvoiceText() {
  console.log("🟢 測試發票內容產生...");
  const invoiceText = printer.generateInvoiceText(mockInvoiceData);
  console.log(invoiceText);

  if (!invoiceText.includes(mockInvoiceData.invoiceNumber)) {
    throw new Error("❌ 發票內容錯誤：未包含發票號碼");
  }

  console.log("✅ 發票內容測試通過\n");
}

// **🟢 測試 2: QR Code 產生**
async function testGenerateQRCode() {
  console.log("🟢 測試 QR Code 產生...");
  const qrImage = await printer.generateInvoiceQRCode(mockInvoiceData);

  if (!qrImage) {
    throw new Error("❌ QR Code 生成失敗");
  }

  const qrOutputPath = 'tests/qr_test.png';
  await qrImage.writeAsync(qrOutputPath);

  if (!fs.existsSync(qrOutputPath)) {
    throw new Error("❌ QR Code 檔案未正確存儲");
  }

  console.log(`✅ QR Code 產生成功，存儲於: ${qrOutputPath}\n`);
}

// **🟢 測試 3: 發票列印**
async function testPrintInvoice() {
  console.log("🟢 測試發票列印...");
  await printer.printInvoice(mockInvoiceData);
  console.log("✅ 發票列印測試通過\n");
}

// **🟢 測試 4: 發票格式轉換**
function testInvoicePeriodConversion() {
  console.log("🟢 測試發票期別轉換...");
  const result = InvoiceUtils.convertInvoicePeriod("11301");

  if (result !== "113年01-02月") {
    throw new Error(`❌ 發票期別轉換錯誤，預期: 113年01-02月，實際: ${result}`);
  }

  console.log("✅ 發票期別轉換測試通過\n");
}

// **🟢 測試 5: 錯誤處理**
async function testErrorHandling() {
  console.log("🟢 測試錯誤處理...");
  try {
    await printer.printInvoice(null);
    console.log("❌ 錯誤處理未正確拋出異常");
  } catch (error) {
    console.log("✅ 正確捕捉到錯誤:", error.message);
  }

  try {
    await printer.generateInvoiceQRCode(null);
    console.log("❌ QR Code 生成錯誤處理未正確拋出異常");
  } catch (error) {
    console.log("✅ 正確捕捉到 QR Code 生成錯誤:", error.message);
  }
}

// **🚀 執行所有測試**
async function runAllTests() {
  console.log("\n🚀 開始所有 InvoicePrinter 測試...\n");

  testGenerateInvoiceText();
  await testGenerateQRCode();
  await testPrintInvoice();
  testInvoicePeriodConversion();
  await testErrorHandling();

  console.log("\n🎉 所有測試完成！\n");
}

// **執行測試**
runAllTests();
