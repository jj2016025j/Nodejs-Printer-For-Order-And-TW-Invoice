const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const Jimp = require('jimp');
const qr = require('qr-image');
const streamToBuffer = require('stream-to-buffer');

const device = new escpos.USB();
const printer = new escpos.Printer(device);

async function printSingleQRCode(content) {
    device.open(async function (error) {
        if (error) {
            console.error('打印機連接錯誤:', error);
            return;
        }
        console.log('打印機連接成功');
        
        const outputPath = await generateSingleQRCode(content).catch(console.error);
        console.log('outputPath', outputPath);
        
        await printImage(outputPath);
        printer.close();
        console.log('打印完成');
    });
}

async function printDoubleQRCode(leftQRContent, rightQRContent) {
    device.open(async function (error) {
        if (error) {
            console.error('打印機連接錯誤:', error);
            return;
        }
        console.log('打印機連接成功');
        
        const outputPath = await generateMergedQRCodes(leftQRContent, rightQRContent).catch(console.error);
        console.log('outputPath', outputPath);
        
        await printImage(outputPath);
        printer.close();
        console.log('打印完成');
    });
}

async function printImage(imagePath) {
    return new Promise((resolve, reject) => {
        escpos.Image.load(imagePath, (image) => {
            printer.raster(image);
            printer.flush(() => {
                resolve();
            });
        });
    });
}

const createQRCode = async (text, size) => {
    const qrStream = qr.image(text, { type: 'png', size: size });
    return new Promise((resolve, reject) => {
        streamToBuffer(qrStream, (err, buffer) => {
            if (err) reject(err);
            else Jimp.read(buffer).then(image => resolve(image)).catch(reject);
        });
    });
};

const generateSingleQRCode = async (url) => {
    const qrImage = await createQRCode(url, 4);
    const outputPath = 'single_qr.png';
    await qrImage.writeAsync(outputPath);
    return outputPath;
};

const mergeQRCodes = async (qr1, qr2) => {
    const mergedImage = new Jimp(qr1.bitmap.width + qr2.bitmap.width, Math.max(qr1.bitmap.height, qr2.bitmap.height));
    mergedImage.blit(qr1, 0, 0);
    mergedImage.blit(qr2, qr1.bitmap.width, 0);
    return mergedImage;
};

const generateMergedQRCodes = async (url1, url2) => {
    const qr1 = await createQRCode(url1, 4);
    const qr2 = await createQRCode(url2, 4);
    const mergedImage = await mergeQRCodes(qr1, qr2);
    const outputPath = 'double_qr.png';
    await mergedImage.writeAsync(outputPath);
    return outputPath;
};

const singleQRContent = 'https://example.com/single';
const leftQRContent = 'https://example.com/left';
const rightQRContent = 'https://example.com/right';

printSingleQRCode(singleQRContent);
printDoubleQRCode(leftQRContent, rightQRContent);