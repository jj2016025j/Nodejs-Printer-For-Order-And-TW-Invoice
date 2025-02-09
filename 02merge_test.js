const PrinterHandler = require('./PrinterHandler');
const QRCodeGenerator = require('./QRCodeGenerator');
const ImageMerger = require('./ImageMerger');

const url1 = 'https://lee871116.ddns.net';
const url2 = 'https://lee871116.ddns.net';
const outputPath = 'output.png';

async function printMergedQRCodes() {
  try {
    const qr1 = await QRCodeGenerator.createQRCode(url1, 5);
    const qr2 = await QRCodeGenerator.createQRCode(url2, 5);
    const mergedImage = await ImageMerger.mergeQRCodes(qr1, qr2);

    await mergedImage.writeAsync(outputPath);
    console.log(`QR 碼合併成功: ${outputPath}`);

    const printer = new PrinterHandler();
    await printer.printImage(outputPath);
  } catch (error) {
    console.error('錯誤:', error);
  }
}

printMergedQRCodes();
