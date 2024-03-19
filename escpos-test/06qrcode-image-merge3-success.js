const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');
const fs = require('fs');

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

async function printMergedQRCodes(device, printer, url1, url2) {
    const qr1 = await createQRCode(url1, 5);
    const qr2 = await createQRCode(url2, 5);
    const mergedImage = await mergeQRCodes(qr1, qr2);

    const outputPath = 'output.png';
    await mergedImage.writeAsync(outputPath);

    device.open(function () {
        escpos.Image.load(outputPath, function (image) {
            printer.raster(image);
            printer.close();
        });
    });
}

const device = new escpos.USB();
const options = { encoding: "Big5", width: 42 }
const printer = new escpos.Printer(device, options);

printMergedQRCodes(device, printer, 'https://lee871116.ddns.net', 'https://lee871116.ddns.net').catch(console.error);
