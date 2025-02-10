const TextPrinter = require('../core/TextPrinter');

console.log("\n🚀 開始測試 TextPrinter...\n");

// 初始化印表機
let printer;
try {
  printer = new TextPrinter();
  console.log("✅ PrinterHandler 初始化成功");
} catch (error) {
  console.error("❌ PrinterHandler 初始化失敗:", error);
  process.exit(1); // 直接結束測試，避免後續測試報錯
}

// 🟢 測試文字列印
function testPrintText() {
  console.log("🟢 測試文字樣式...");
  printer.printSampleText();
}

// 🟢 測試條碼列印
function testPrintBarcode() {
  console.log("🟢 測試條碼列印...");
  printer.openDevice((p) => {
    printer.printBarcodeSection(p);
  });
}

// 🟢 測試 QR 碼列印
function testPrintQRCode() {
  console.log("🟢 測試 QR 碼列印...");
  printer.openDevice((p) => {
    printer.printQRCodeSection(p);
  });
}

// 🟢 測試文字對齊
function testPrintAlignment() {
  console.log("🟢 測試文字對齊...");
  printer.openDevice((p) => {
    printer.printAlignmentSection(p);
  });
}

// 🟢 測試表格列印
function testPrintTable() {
  console.log("🟢 測試表格列印...");
  printer.openDevice((p) => {
    printer.printTableSection(p);
  });
}

// **執行所有測試**
async function runAllTests() {
  console.log("\n🚀 開始所有 TextPrinter 測試...\n");

  testPrintText();         // 測試基本文字列印
  testPrintBarcode();      // 測試條碼
  testPrintQRCode();       // 測試 QR Code
  testPrintAlignment();    // 測試對齊
  testPrintTable();        // 測試表格

  console.log("\n🎉 所有測試完成！\n");
}

runAllTests();
