const Jimp = require('jimp');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const qr = require('qr-image');

const streamToBuffer = require('stream-to-buffer');

async function createQRCode(text, size) {
    const qrStream = qr.image(text, { type: 'png', size: size });
    return new Promise((resolve, reject) => {
        streamToBuffer(qrStream, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                Jimp.read(buffer).then(image => resolve(image)).catch(reject);
            }
        });
    });
}

async function mergeQRCodes(qr1, qr2) {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
}
const content = 'https://github.com/jj2016025j/'

async function printMergedQRCodes() {
    const qr1 = await createQRCode(content, 5);
    const qr2 = await createQRCode(content, 5);
    const mergedImage = await mergeQRCodes(qr1, qr2);

    // 将Jimp图像转换为打印机可以打印的格式
    mergedImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
            console.error(err);
            return;
        }

        const outputPath = 'output.png';
        require('fs').writeFileSync(outputPath, buffer);

        const device = new escpos.USB();
        const options = { encoding: "Big5", width: 42 }
        const printer = new escpos.Printer(device, options);

        device.open(async function (error) {
            if (error) {
                console.error('打印机连接错误:', error);
                return;
            }

            // 修正: 确保使用 escpos.Image.load 的回调函数正确处理图像
            escpos.Image.load(outputPath, function (err, image) {
                if (err) {
                    console.error('加载图像失败:', err);
                    return;
                }

                // 在 .image 的回调函数中处理后续操作
                printer.image(image, 's8', function () {
                    this.close();
                });
            });
        });
    });
}

// 调用打印函数
printMergedQRCodes().catch(console.error);
