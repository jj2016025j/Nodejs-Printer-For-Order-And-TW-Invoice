const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

const device = new escpos.USB();
const printer = new escpos.Printer(device);

/**
 * 產生 QR Code 圖片
 * @param {string} text 內容
 * @param {number} size 大小
 * @returns {Promise<Jimp>}
 */
async function createQRCode(text, size = 5) {
    const qrStream = qr.image(text, { type: 'png', size: size });
    return new Promise((resolve, reject) => {
        streamToBuffer(qrStream, (err, buffer) => {
            if (err) reject(err);
            else Jimp.read(buffer).then(resolve).catch(reject);
        });
    });
}

/**
 * 合併兩個 QR Code 圖片
 * @param {Jimp} qr1 左側 QR Code
 * @param {Jimp} qr2 右側 QR Code
 * @returns {Promise<Jimp>}
 */
async function mergeQRCodes(qr1, qr2) {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
}

/**
 * 產生合併的 QR Code 並保存
 * @returns {Promise<string>}
 */
async function generateMergedQRCode() {
    const qr1 = await createQRCode("Left QR Code", 5);
    const qr2 = await createQRCode("Right QR Code", 5);
    const mergedImage = await mergeQRCodes(qr1, qr2);
    const outputPath = "merged_qr_output.png";
    await mergedImage.writeAsync(outputPath);
    return outputPath;
}

/**
 * 列印圖片
 * @param {string} imagePath 圖片路徑
 */
function printImage(imagePath) {
    device.open(function (error) {
        if (error) {
            console.error("打印機連接錯誤:", error);
            return;
        }
        console.log("打印機連接成功，開始列印圖片:", imagePath);

        escpos.Image.load(imagePath, function ( image) {
            // if (err) {
            //     console.error("無法載入圖片:", err);
            //     return;
            // }
            printer.raster(image);
            printer.cut();
            printer.close(() => {
                console.log("圖片列印完成");
            });
        });
    });
}

/**
 * 測試完整流程：生成 QR Code -> 合併 -> 列印
 */
(async () => {
    try {
        console.log("開始產生 QR Code 並合併...");
        const mergedQRCodePath = await generateMergedQRCode();
        console.log("QR Code 產生完成:", mergedQRCodePath);

        console.log("開始列印圖片...");
        setTimeout(() => printImage(mergedQRCodePath), 2000);

    } catch (error) {
        console.error("發生錯誤:", error);
    }
})();
