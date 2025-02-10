const escpos = require('escpos');
const path = require('path');
const PrintUtils = require('./PrintUtils'); // 確保路徑正確

// 設定列印機裝置（例如 USB, Serial Port, Network, Bluetooth）
const device = escpos.USB(); // 依據你的設備進行修改
const printer = new escpos.Printer(device);

// 圖片測試清單
const imagePaths = [
    "C:\\Users\\User\\Github\\models\\printer\\src\\test_saved_qr.png",
    "C:\\Users\\User\\Github\\models\\printer\\src\\test.png",
    "C:\\Users\\User\\Github\\models\\printer\\src\\processed_output.jpg",
    "C:\\Users\\User\\Github\\models\\printer\\src\\00test.png"
];

(async () => {
    device.open(async (err) => {
        if (err) {
            console.error("❌ 無法開啟列印機:", err.message);
            return;
        }

        for (const imagePath of imagePaths) {
            console.log(`🔍 測試列印: ${imagePath}`);
            try {
                await PrintUtils.printImage(device, imagePath);
                console.log(`✅ 成功列印: ${imagePath}`);
            } catch (error) {
                console.error(`❌ 列印失敗 (${imagePath}): ${error.message}`);
            }
        }

        printer.close();
        console.log("📄 測試完成");
    });
})();
