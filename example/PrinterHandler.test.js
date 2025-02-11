const PrinterHandler = require('../core/PrinterHandler');

console.log("🔍 開始測試 PrinterHandler...");

const printer = new PrinterHandler();

printer.device; // 這行執行應該不會報錯

console.log("🟢 測試開啟設備與關閉設備...");
printer.openDevice(() => {
  printer.closeDevice();
});

console.log("🟢 測試基本文字打印...");
printer.printText("測試基本文字打印..."); // 這行執行應該不會報錯
