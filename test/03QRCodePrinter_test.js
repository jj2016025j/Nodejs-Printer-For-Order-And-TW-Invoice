const QRCodePrinter = require('../QRCodePrinter');

const printer = new QRCodePrinter();

const testCases = [
  { data: "https://example.com", size: 5, errorCorrection: 'H', description: "標準網址 QR 碼" },
  { data: "Hello, World!", size: 3, errorCorrection: 'M', description: "普通文字 QR 碼" },
  { data: "https://github.com", size: 8, errorCorrection: 'Q', description: "大尺寸 QR 碼" },
  { data: "Data with high redundancy", size: 6, errorCorrection: 'H', description: "高錯誤校正 QR 碼" },
  { data: "1234567890", size: 4, errorCorrection: 'L', description: "數字 QR 碼" },
  { data: "特殊字符：!@#$%^&*()", size: 5, errorCorrection: 'Q', description: "特殊字符 QR 碼" },
];

// 使用異步列印，確保每個 QR 碼能獨立處理
(async () => {
  for (const test of testCases) {
    console.log(`📌 測試: ${test.description}`);
    printer.printQRCode(test.data, test.size, test.errorCorrection);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 確保每次列印有間隔
  }
  console.log("✅ 所有 QR 碼列印完成");
})();

// 測試列印雙 QR 碼
printer.printDualQRCode("https://github.com/jj2016025j/", "https://lee871116.ddns.net", 5);