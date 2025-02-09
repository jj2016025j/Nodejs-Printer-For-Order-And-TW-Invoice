const RawTextPrinter = require('../core/RawTextPrinter');

const printer = new RawTextPrinter();

/**
 * 測試 ASCII 純文字列印
 */
function testPrintAscii() {
  console.log("\n🟢 測試 ASCII 文字列印...");
  printer.printRawText("Hello, ESC/POS Printer!", { align: "left" });
}

/**
 * 測試 BIG5（繁體中文）文字列印
 */
function testPrintBig5() {
  console.log("\n🟢 測試 BIG5 文字列印...");
  printer.printRawText("歡迎光臨！", { encoding: "big5", align: "center" });
}

/**
 * 測試 UTF-8 文字列印
 */
function testPrintUtf8() {
  console.log("\n🟢 測試 UTF-8 文字列印...");
  printer.printRawText("こんにちは、世界！", { encoding: "utf8", align: "right" });
}

/**
 * 測試加粗文字列印
 */
function testPrintBold() {
  console.log("\n🟢 測試加粗文字列印...");
  printer.printRawText("加粗測試", { bold: true });
}

/**
 * 測試底線文字列印
 */
function testPrintUnderline() {
  console.log("\n🟢 測試底線文字列印...");
  printer.printRawText("底線測試", { underline: true });
}

/**
 * 測試綜合格式（加粗 + 底線 + 置中）
 */
function testPrintStyled() {
  console.log("\n🟢 測試綜合格式（加粗 + 底線 + 置中）...");
  printer.printRawText("格式測試", { bold: true, underline: true, align: "center" });
}

/**
 * 測試含切紙的文字列印
 */
function testPrintWithCut() {
  console.log("\n🟢 測試含切紙的文字列印...");
  printer.printRawText("這是一段含切紙的測試", { cut: true });
}

// **執行所有測試**
async function runAllTests() {
  console.log("\n🚀 開始所有 RawTextPrinter 測試...\n");

  testPrintAscii();
  testPrintBig5();
  testPrintUtf8(); //亂碼
  testPrintBold();
  testPrintUnderline();
  testPrintStyled();
//   testPrintWithCut();

  console.log("\n🎉 所有測試完成！\n");
}

runAllTests();
