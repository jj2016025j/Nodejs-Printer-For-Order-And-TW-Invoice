const PrinterHandler = require('../core/PrinterHandler');
const fs = require('fs');

console.log("🔍 開始測試 PrinterHandler...");

const printer = new PrinterHandler();

// 🟢 測試設備初始化
function testInitializeDevice() {
  console.log("🟢 測試設備初始化...");
  try {
    printer.device; // 這行執行應該不會報錯
    console.log("✅ 設備初始化成功");
  } catch (error) {
    console.error("❌ 設備初始化失敗:", error.message);
  }
}

// 🟢 測試開啟設備與關閉設備
function testOpenAndCloseDevice() {
  console.log("🟢 測試開啟設備與關閉設備...");
  try {
    printer.openDevice(() => {
      console.log("✅ 設備成功開啟");
      printer.closeDevice();
      console.log("✅ 設備成功關閉");
    });
  } catch (error) {
    console.error("❌ 設備開啟/關閉失敗:", error.message);
  }
}

// 🟢 測試純文字列印
function testPrintText() {
  console.log("🟢 測試純文字列印...");
  try {
    printer.printText("🚀 測試純文字列印成功!");
    console.log("✅ 純文字列印測試完成");
  } catch (error) {
    console.error("❌ 純文字列印測試失敗:", error.message);
  }
}

// 🟢 測試圖片列印（確保圖片存在）
function testPrintImage(imagePath) {
  console.log(`🟢 測試圖片列印: ${imagePath}...`);
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ 測試圖片 ${imagePath} 不存在，請檢查路徑`);
    return;
  }

  try {
    printer.printImage(imagePath);
    console.log(`✅ 圖片列印測試成功: ${imagePath}`);
  } catch (error) {
    console.error(`❌ 圖片列印測試失敗: ${imagePath}`, error.message);
  }
}

// 🟢 測試錯誤處理 - 無效圖片
function testInvalidImage() {
  console.log("🟢 測試無效圖片列印...");
  try {
    printer.printImage("invalid_path.jpg");
    console.log("❌ 無效圖片測試未通過（應該拋出錯誤）");
  } catch (error) {
    console.log("✅ 無效圖片測試通過:", error.message);
  }
}

// **執行所有測試**
async function runAllTests() {
  console.log("\n🚀 開始所有 PrinterHandler 測試...\n");

  testInitializeDevice();
  testOpenAndCloseDevice();
  testPrintText();

  // 測試可用圖片（請確保這些圖片存在）
  testPrintImage('../src/qr1.png');
  testPrintImage('../src/output.png');
  testPrintImage('../src/00test.png');

  testInvalidImage();

  console.log("\n🎉 所有測試完成！\n");
}

runAllTests();

