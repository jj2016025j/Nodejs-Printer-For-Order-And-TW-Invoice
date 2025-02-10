const QRCodeUtils = require('./utils/QRCodeUtils');

(async () => {
    try {
        console.log("開始測試 QR Code 生成...");
        const qrImage = await QRCodeUtils.createQRCode("Hello, QR Code!", 5);
        await qrImage.writeAsync("test_qr.png");
        console.log("QR Code 生成成功: test_qr.png");
    } catch (error) {
        console.error("QR Code 生成測試失敗:", error);
    }
})();

(async () => {
    try {
        console.log("開始測試合併 QR Code...");
        const leftQR = await QRCodeUtils.createQRCode("Left QR Code", 5);
        const rightQR = await QRCodeUtils.createQRCode("Right QR Code", 5);
        
        const mergedImage = await QRCodeUtils.mergeQRCodes(leftQR, rightQR);
        await mergedImage.writeAsync("test_merged_qr.png");

        console.log("合併 QR Code 測試成功: test_merged_qr.png");
    } catch (error) {
        console.error("合併 QR Code 測試失敗:", error);
    }
})();
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const PrintUtils = require('./utils/PrintUtils');

const device = new escpos.USB();

device.open(async function (error) {
    if (error) {
        console.error("列印機連接失敗:", error);
        return;
    }

    try {
        console.log("開始測試圖片列印...");
        await PrintUtils.printImage(device, "test_merged_qr.png");
        console.log("圖片列印測試成功");
    } catch (error) {
        console.error("圖片列印測試失敗:", error);
    }
});
