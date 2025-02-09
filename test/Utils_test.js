const fs = require('fs');
const InvoiceUtils = require('../utils/InvoiceUtils');
const TextUtils = require('../utils/TextUtils');
const DateUtils = require('../utils/DateUtils');
const QRCodeUtils = require('../utils/QRCodeUtils');

console.log("\n🚀 ✅ 開始測試所有工具函式...\n");

// 🟢 測試 InvoiceUtils
function testConvertInvoicePeriod() {
    console.log("🟢 測試 convertInvoicePeriod()...");
    const result = InvoiceUtils.convertInvoicePeriod("10403");
    const expected = "104年03-04月";
    if (result !== expected) {
        throw new Error(`❌ convertInvoicePeriod() 失敗: 預期 ${expected}，但獲得 ${result}`);
    }
    console.log("✅ convertInvoicePeriod() 通過");
}

function testValidateInvoicePeriod() {
    console.log("🟢 測試 validateInvoicePeriod()...");
    if (!InvoiceUtils.validateInvoicePeriod("10404") || InvoiceUtils.validateInvoicePeriod("abcde")) {
        throw new Error("❌ validateInvoicePeriod() 失敗");
    }
    console.log("✅ validateInvoicePeriod() 通過");
}

function testFormatInvoiceDate() {
    console.log("🟢 測試 formatInvoiceDate()...");
    const testDate = "2024-03-18 11:22:33";
    const expected = "2024-03-18";
    const result = InvoiceUtils.formatInvoiceDate(testDate);
    if (result !== expected) {
        throw new Error(`❌ formatInvoiceDate() 失敗: 預期 ${expected}，但獲得 ${result}`);
    }
    console.log("✅ formatInvoiceDate() 通過");
}

// 🟢 測試 TextUtils
function testCalculatePadding() {
    console.log("🟢 測試 calculatePadding()...");
    const result = TextUtils.calculatePadding("測試字", 10);
    if (result.length !== 10) {
        throw new Error(`❌ calculatePadding() 失敗: 預期長度 10, 但獲得 ${result.length}`);
    }
    console.log("✅ calculatePadding() 通過");
}

function testFormatInvoiceItems() {
    console.log("🟢 測試 formatInvoiceItems()...");
    const items = [
        { name: 'LED顯示器', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
        { name: '無線鍵盤', quantity: 2, unitPrice: 700, totalPrice: 1400 }
    ];
    const result = InvoiceUtils.formatInvoiceItems(items);
    if (!result.includes("LED顯示器") || !result.includes("無線鍵盤")) {
        throw new Error("❌ formatInvoiceItems() 失敗: 缺少預期文本");
    }
    console.log("✅ formatInvoiceItems() 通過");
}

// 🟢 測試 DateUtils
function testFormatDateTime() {
    console.log("🟢 測試 formatDateTime()...");
    const formattedDateTime = DateUtils.formatDateTime();
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!dateRegex.test(formattedDateTime)) {
        throw new Error(`❌ formatDateTime() 失敗: ${formattedDateTime}`);
    }
    console.log("✅ formatDateTime() 通過");
}

function testFormatInvoiceDateInDateUtils() {
    console.log("🟢 測試 DateUtils.formatInvoiceDate()...");
    const testDate = "2024-03-18 11:22:33";
    const expectedOutput = "2024-03-19";
    const result = DateUtils.formatInvoiceDate(testDate);
    if (result !== expectedOutput) {
        throw new Error(`❌ formatInvoiceDate() 失敗: 預期 ${expectedOutput}，但獲得 ${result}`);
    }
    console.log("✅ formatInvoiceDate() 通過");
}

// 🟢 測試 QRCodeUtils
async function testQRCodeUtils() {
    console.log("🟢 測試 QRCodeUtils...");
    
    // 測試 1: 生成單個 QR 碼
    console.log("🟢 生成單個 QR 碼...");
    const qrImage = await QRCodeUtils.createQRCode('https://example.com', 5);
    await qrImage.writeAsync('test_qr.png');
    if (!fs.existsSync('test_qr.png')) {
        throw new Error("❌ 單個 QR 碼未成功生成");
    }
    console.log("✅ 單個 QR 碼已生成: test_qr.png");

    // 測試 2: 生成並合併兩個 QR 碼
    console.log("🟢 生成並合併兩個 QR 碼...");
    const qr1 = await QRCodeUtils.createQRCode('https://left-url.com', 5);
    const qr2 = await QRCodeUtils.createQRCode('https://right-url.com', 5);
    const mergedImage = await QRCodeUtils.mergeQRCodes(qr1, qr2);
    await mergedImage.writeAsync('merged_qr.png');
    if (!fs.existsSync('merged_qr.png')) {
        throw new Error("❌ 合併 QR 碼未成功生成");
    }
    console.log("✅ 合併 QR 碼已生成: merged_qr.png");
}

// **執行所有測試**
(async () => {
    try {
        testConvertInvoicePeriod();
        testValidateInvoicePeriod();
        testFormatInvoiceDate();
        // testCalculatePadding();
        testFormatInvoiceItems();
        testFormatDateTime();
        testFormatInvoiceDateInDateUtils();
        await testQRCodeUtils();

        console.log("\n🎉🚀 所有測試通過！");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
