const QRCodeUtils = require('../utils/QRCodeUtils');
const fs = require('fs').promises;
const Jimp = require('jimp');

async function runTests() {
  console.log('🚀 開始測試 QRCodeUtils');

  try {
    /** 測試：產生 QR Code */
    console.log('✅ 測試：產生 QR Code');
    const qrPath = 'test_qr.png';
    await QRCodeUtils.createQRCode('https://example.com', 5, qrPath);
    if (await fs.stat(qrPath)) {
      console.log(`✅ 產生 QR Code 成功: ${qrPath}`);
    }

    /** 測試：儲存 QR Code */
    console.log('✅ 測試：儲存 QR Code');
    const qrImage = await QRCodeUtils.createQRCodeBuffer('Test Save', 4);
    const savePath = 'test_saved_qr.png';
    await QRCodeUtils.saveImage(qrImage, savePath);
    if (await fs.stat(savePath)) {
      console.log(`✅ 儲存 QR Code 成功: ${savePath}`);
    }

    /** 測試：合併 QR Code */
    console.log('✅ 測試：合併 QR Code');
    const qr1 = await QRCodeUtils.createQRCodeBuffer('Hello', 4);
    const qr2 = await QRCodeUtils.createQRCodeBuffer('World', 4);
    const merged = await QRCodeUtils.mergeQRCodes(qr1, qr2);
    const mergedPath = 'test_merged_qr.png';
    await merged.writeAsync(mergedPath);
    if (await fs.stat(mergedPath)) {
      console.log(`✅ 合併 QR Code 成功: ${mergedPath}`);
    }

    /** 測試：產生並合併 QR Code */
    console.log('✅ 測試：產生並合併 QR Code');
    const finalOutput = 'test_final_merged_qr.png';
    await QRCodeUtils.generateMergedQRCode('左側 QR', '右側 QR', 4, finalOutput);
    if (await fs.stat(finalOutput)) {
      console.log(`✅ 產生並合併 QR Code 成功: ${finalOutput}`);
    }

    /** 錯誤測試 */
    console.log('🛑 測試：QR Code 內容為空');
    try {
      await QRCodeUtils.createQRCode('', 4, 'test_empty_qr.png');
      console.error('❌ 失敗：應該拋出錯誤');
    } catch (error) {
      console.log('✅ 成功：捕獲到錯誤', error.message);
    }

    console.log('🛑 測試：QR Code 大小超出範圍');
    try {
      await QRCodeUtils.createQRCode('Test', 20, 'test_invalid_size_qr.png');
      console.error('❌ 失敗：應該拋出錯誤');
    } catch (error) {
      console.log('✅ 成功：捕獲到錯誤', error.message);
    }

    console.log('🛑 測試：合併非 QR Code 影像');
    try {
      const randomImage = new Jimp(100, 100, 0xFFFFFFFF);
      await QRCodeUtils.mergeQRCodes(randomImage, qr1);
      console.error('❌ 失敗：應該拋出錯誤');
    } catch (error) {
      console.log('✅ 成功：捕獲到錯誤', error.message);
    }

    console.log('🎉 所有測試通過！');
  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }
}

runTests();

async function testQRCodeSizes() {
  console.log('🚀 測試不同大小的 QR Code');

  try {
    /** 測試不同大小的 QR Code (1~16) */
    for (let size = 1; size <= 16; size++) {
      console.log(`✅ 測試：產生 size=${size} 的 QR Code`);
      const outputPath = `test_qr_size_${size}.png`;
      await QRCodeUtils.createQRCode(`Size ${size}`, size, outputPath);
      const image = await Jimp.read(outputPath);

      if (await fs.stat(outputPath)) {
        console.log(`✅ 成功產生 size=${size} 的 QR Code: ${outputPath}`);
      }

      console.log(`🔍 確認圖片尺寸: ${image.bitmap.width} x ${image.bitmap.height}`);
    }

    /** 測試邊界條件 (size = 0) */
    console.log('🛑 測試：QR Code 大小過小 (size = 0)');
    try {
      await QRCodeUtils.createQRCode('Invalid Size', 0, 'test_invalid_size_0.png');
      console.error('❌ 失敗：應該拋出錯誤');
    } catch (error) {
      console.log('✅ 成功：捕獲到錯誤', error.message);
    }

    /** 測試邊界條件 (size = 17) */
    console.log('🛑 測試：QR Code 大小過大 (size = 17)');
    try {
      await QRCodeUtils.createQRCode('Invalid Size', 17, 'test_invalid_size_17.png');
      console.error('❌ 失敗：應該拋出錯誤');
    } catch (error) {
      console.log('✅ 成功：捕獲到錯誤', error.message);
    }

    console.log('🎉 所有大小測試通過！');

  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }
}

testQRCodeSizes();
